import TableRowIterator from "./tableRowIterator.js";
import {TableState, TableAction, TableStateMachine} from "./tableStateMachine.js";

export default function LazyTable(options) {
	/*
	 * Relevant DOM objects.
	 */
	const that = this;
	const table = this.find('table:not(.fixed-header)');
	var tableBody = this.find('table tbody');
	if(tableBody.length==0) {
		tableBody=$('<tbody></tbody>')
		tableBody.appendTo(table);
	}
	var columnVisibility={};
	
	/*
	 * Init settings.
	 */
	const defaults = {
			debug: false,         // output console logs
			trHeight: 0,          // height of a single row - set to 0 for automatic determination
			data: [],             // raw data
			generator: function(row) {  }, // function to turn array into html code for table row
			startIndex: 0,        // initially centered element
			keepExisting: true,   // if true, rows will not be deleted when getting out of visible area 
			prefetch: 0,          // number of rows by which to extend visible area
			animationCalcTime: 3, // milliseconds
			template: {},		  // table Columns toggle template
			toggleButton: undefined,
			appendFn: function(rows) {
				//console.log();
				var _rows=$(rows.join());
				tableBody.append(_rows); 
				tableBody.trigger('create');
				
				//$(that).trigger({type:"rowAdded",rows:_rows});
			},
			prependFn: function(rows) { 
				var _rows=$(rows.join());
				tableBody.prepend(_rows); 
				tableBody.trigger('create');
				//$(that).trigger({type:"rowAdded",rows:_rows});
			},
			deleteFn: function(startIndex, endIndex) { 
				tableBody.children().slice(startIndex, endIndex).remove();
			},
			addRow:function(row){
				tableBody.prepend(row); 
				tableBody.trigger('create');
				//console.log($(row).find('td').wrapInner('<div />').children());
				var tds=$(row).find('td').wrapInner('<div />').children();
				tds.css({'margin-top':'-70px'})
				tds.animate({'margin-top':'0px'},1000,function(){
					tds.contents().unwrap();
					$(row).addClass('newTableItem');
					$(row).on('click',(e)=>{$(row).removeClass('newTableItem');$(row).off('click','**')});
				})
			},
			removeRow:function(index){

			},
			updateData:function(data){
				nextIter = new TableRowIterator(settings.generator, data);
				nextIter.setCurrent(settings.startIndex);
				prevIter = nextIter.clone();
				stateMachine = new TableStateMachine();
				init();
			},
			onInit: null,         // callback function - will be called after initialization has finished
			onRedraw: null        // callback function - will be called after rows have been added or removed
	};
	const settings = $.extend({}, defaults, options);
	
	$(that).on('rowAdded',function(e){
		setTimeout(() => {
			$.each(e.rows.find('td'),(index,td)=>{
				if(columnVisibility[$(td).attr('name')]){
					$(td).show();
				}else{
					$(td).hide();
				}
			});
		}, 5);
		
	})
	/*
	 * Init plugin-global variables.
	 */
	/* Seekable Iterators over data */
	var nextIter = new TableRowIterator(settings.generator, settings.data);
	nextIter.setCurrent(settings.startIndex);
	var prevIter = nextIter.clone();
	
	/* State machine for handling table states and transitions. */
	var stateMachine = new TableStateMachine();
	
	/* Flag to indicate that a resize event is being worked on already. */
	var resizeAnimationWorking = false;
	
	/* The currently focused index - to be refocused on resize. */
	var focusedIndex = false;

	//var shortest=50;
	var canRun=true;
	const headResizeObserver = new ResizeObserver(entries => {
		//setFontSize();
		//setTimeout(setFontSize, 2000);
		const intervalId = setInterval(() => {
			if (canRun) {
				clearInterval(intervalId);
				setFontSize();
				canRun=false;
			}
		}, 1000);
		
		setTimeout(() => {
			canRun=true;
		}, 1000);
	});
	const resizeObserver = new ResizeObserver(entries => {
		
		//setFontSize();
        for (let entry of entries) {
            // Check if the observed element is the one you are interested in
            //if (entry.target === targetElement) {
            // Log the new width of the element
			/*
			if($(entry.target).text()=="状态"){
				if($(entry.target).width()<50){
					
					setTimeout(() => {
						that.find('table').addClass('font12')
						that.find('table').trigger('create')
					},500);
					
				}else{
					setTimeout(() => {
						that.find('table').removeClass('font12')
						that.find('table').trigger('create')
					},500);
				}
				
			}
			*/
			
			var clone=$(entry.target).jqmData('clone');
			if($(clone).width()!=$(entry.target).width())
            //console.log('Element width changed to: ' + $(entry.target).width(),$(clone).width(),entry.target);
            	$(clone).css('width',$(entry.target).width());
            // Perform any actions you want when the width changes
            // For example, update layout or trigger a function
			
			
            
        }
		
    });
	const setFixedHead = function() {
		//console.log('thead',table.find('thead'));
		var _Header=table.find('thead').clone();
		var _table_fixed=$('<table data-role="table" class="ui-responsive table-stroke fixed-header" style="margin: 0px 0px;text-shadow: none;width: 100%;position: fixed;z-index:100;"></table>');
		_Header.css({'background': '#262626',color:'white'})
		_table_fixed.append(_Header);
		that.prepend(_table_fixed);
		_table_fixed.trigger('create');
		//_table_fixed.hide();
		that.trigger('create');
		var _ths=_table_fixed.find('thead').find('th');
		$.each(table.find('thead').find('th'),(index,th)=>{
			$(th).jqmData('clone',_ths[index]);
			resizeObserver.observe(th);
		});
		headResizeObserver.observe(_Header.get( 0 ));
	}
	const setSearchInput = function(){
		//data-filter="true" data-input="#filterTable-input"
		if($(table).jqmData('input') != undefined){
			//console.log('setSearchInput',$($(table).jqmData('input')));
			$($(table).jqmData('input')).on('change paste keyup',function(e){
				
				//console.log($(this).val());
				that.trigger({type:"filterChanged",value:$(this).val()})
			})
		}
	}
	
	const tableColumnToggle= function(){
		var ids=Object.keys(settings.template);
		//console.log('tableColumnToggle',settings.template,settings.toggleButton,(settings.template.length>0 && settings.toggleButton!=undefined));
		if(ids.length>0 && settings.toggleButton!=undefined){
			console.log('tableColumnToggle ok');
			
			var filterables={};
			var hiddenList={};
			var duration=500;
			var filterPopup=$('<div data-role="popup" data-theme="a" class="ui-corner-all"></div>');
			//$(that).append($(settings.toggleButton));
			$(that).append(filterPopup);
			$(settings.toggleButton).on('click',function(e){
				$(filterPopup).popup('open');
				$(filterPopup).popup('reposition',{x:e.pageX,y:e.pageY});
			})
			
			
			var filterForm=$('<form></form>');
			var filterFielset=$('<fieldset data-role="controlgroup" style="margin:0px;"></fieldset>');
			filterForm.append(filterFielset);
			filterPopup.append(filterForm);
			
			
			filterPopup.popup({
				afterclose: function( event, ui ) {
					//console.log(getGlobal('currentPage'));
				}
			});
		
			$.each(ids,function(index,id){
				var columnData=settings.template[id];
				if(columnData.isFilterable){
					columnVisibility[id]=true;
					filterables[id]=columnData.label;
					hiddenList[id]=columnData.isHidden;
					var checked=!columnData.isHidden?" checked='checked'":"";
					var input=$('<input type="checkbox" name="'+id+'" id="'+id+'-column'+'"'+checked+'>');
					var label=$('<label for="'+id+'-column'+'">'+columnData.label+'</label>');
					filterFielset.append(input);
					filterFielset.append(label);
					input.on("click",function(e){
						//console.log( $('td[name="'+input.prop('name')+'"]'));
						setAvailableColumn(input,duration);
						//saveChangedToUser(target);
						//setTimeout(() => {
							//filterPopup.trigger('columnChanged');
						//}, duration+100);
						
					});
					if(columnData.isHidden){
						
						columnVisibility[id]=false;
						that.find('table').find('th[name="'+id+'"]').hide(1);
						that.find('table').find('td[name="'+id+'"]').hide(1);
					}else{
						that.find('table').find('th[name="'+id+'"]').show(1);
						that.find('table').find('td[name="'+id+'"]').show(1);
					}
				}else{
					columnVisibility[id]=true;
				}
				//hiddenList[columnData.label]=columnData.isHidden;
				//th.jqmData('isHidden',columnData.isHidden);
			});
			filterPopup.trigger('create');filterPopup.trigger('change');
			that.find('table').trigger('create');
			
			setFontSize();
		}
	}
	const setAvailableColumn=function(checkbox,duration){
		columnVisibility[$(checkbox).prop('name')]=$(checkbox).prop('checked');
		if(!$(checkbox).prop('checked')){
			columnVisibility[+$(checkbox).prop('name')]=false;
			that.find('table').find('th[name="'+$(checkbox).prop('name')+'"]').hide(duration);
			that.find('table').find('td[name="'+$(checkbox).prop('name')+'"]').hide(duration);
		}else{
			columnVisibility[+$(checkbox).prop('name')]=true;
			that.find('table').find('th[name="'+$(checkbox).prop('name')+'"]').show(duration);
			that.find('table').find('td[name="'+$(checkbox).prop('name')+'"]').show(duration);
		}
		console.log(columnVisibility);
		setFontSize();
		//restart(1);
	}
	const setFontSize=function(){
		if(table.find('thead').height()>40){
			that.find('table').addClass('font12')
			that.find('table').trigger('create')
		}
		/*
		else if(table.find('thead').height()>40){
			that.find('table').removeClass('font12')
			that.find('table').trigger('create')
		}
		*/
	}
	/* 
	 * *********************************
	 * *****    Helper function    *****
	 * *********************************
	 */
	
	/*
	 * Wait until at least one row is being drawn.
	 */
	const waitForRow = function() {
		return new Promise((resolve, reject) => {
			var tries = 1;
			const wait = function() {
				const rows = tableBody.children();
				if(rows.length > 0) {
					// wait one frame before resolving
					window.setTimeout(function() { resolve(rows.get(0)); }, 16);
				} else if(tries++ < 10){
					// retry
					window.setTimeout(wait, 100);
				} else {
					reject();
				}
			};
			wait();
		});
	};

	
	/*
	 * Create a build animation promise. This animation turns data rows into
	 * DOM Table rows that are appended.
	 */
	const build = function(getFn, testFn, appendFn) {
		return new Promise((resolve, reject) => {
			/*
			 * Only draw a small number of rows to prevent the user interface
			 * from hanging. If the total animation covers a large number of rows
			 * it is spread across several animation frames.
			 */
			const anim = function(taskStartTime) {
				// targetWindow is calculated once per frame
				const targetWindow = calcTargetWindow();
				var html = [];
				
				// spend settings.animationCalcTime for generating rows
				while((stateMachine.getState() != TableState.RESETTING) 
						&& testFn(targetWindow) 
						&& (window.performance.now() - taskStartTime < settings.animationCalcTime)) {
					html.push(getFn());
				}
				
				// append generated rows - this will require additional time 
				// for rendering and painting (so keep animationCalcTime below
				// 16ms)
				if(html.length > 0) {
					appendFn(html);
				}
				
				if(testFn(targetWindow)) {
					// continue animation in next frame
					window.requestAnimationFrame(anim);
				} else {
					// animation done
					resolve(html);
				}
			};
			
			window.requestAnimationFrame(anim);			
		});
	};

	
	/*
	 * Free any rendered rows that are no longer needed. Only relevant
	 * if settings.keepExisting = false
	 */
	const free = function() {
		const currentWindow = calcCurrentWindow();
		const targetWindow = calcTargetWindow();
		
		if(targetWindow.bottom < currentWindow.bottom) {
			nextIter.setCurrent(targetWindow.bottom);
			settings.deleteFn(targetWindow.bottom - currentWindow.bottom); // index will be negative - so removed from the end of the list
			table.css({'margin-bottom': (settings.data.length - targetWindow.bottom) * settings.trHeight});
			if(settings.debug) {
				console.log('[jQuery.Lazytable] bot -' + (currentWindow.bottom - targetWindow.bottom) + ' rows');					
			}			
		}
		if(targetWindow.top > currentWindow.top) {
			prevIter.setCurrent(targetWindow.top);
			settings.deleteFn(0, targetWindow.top - currentWindow.top);
			table.css({'margin-top': targetWindow.top * settings.trHeight});
			if(settings.debug) {
				console.log('[jQuery.Lazytable] top -' + (targetWindow.top - currentWindow.top) + ' rows');					
			}
		}
		// no Promise - return immediately: deleted rows have been out of 
		// visible area anyway
	};

	
	/*
	 * Get the desired window based on current scroll position.
	 */
	const calcTargetWindow = function() {
		const scrollTop = that.scrollTop();
		const w = {
			top: Math.max(Math.floor(scrollTop / settings.trHeight) - settings.prefetch, 0),
			bottom: Math.min(Math.ceil((scrollTop + that.innerHeight()) / settings.trHeight) + settings.prefetch, settings.data.length - 1)
		};
		w.center = Math.min(Math.floor((w.bottom + w.top) / 2), settings.data.length - 1);
		
		return w;
	};
	
	
	/* 
	 * Get the currently drawn window.
	 */
	const calcCurrentWindow = function() {
		const w = {
			top: prevIter.getCurrent(),
			bottom: nextIter.getCurrent()
		};
		w.center = Math.min(Math.floor((w.bottom + w.top) / 2), settings.data.length - 1);
		
		return w;
	};
	
	
	/* 
	 * Move a certain index to center of window, if possible. 
	 */
	const center = function(index) {
		return new Promise((resolve, reject) => {
			const top = Math.min(
					Math.max(index * settings.trHeight - (that.innerHeight() - settings.trHeight)/2, 0),
					that.prop('scrollHeight')
			);
			that.scrollTop(top);
			window.setTimeout(resolve, 16);			
		});
	};
	
	
	/*
	 * Scroll the visible window until the specified index is visible.
	 */
	function scrollTo(index) {
		return new Promise((resolve, reject) => {
			/*
			 * If the desired index is within the currently active area,
			 * the table window will scroll until the desired index reaches
			 * the window's visible area.
			 */
			const offset = index * settings.trHeight;
			const windowTop = that.scrollTop();
			const windowHeight = that.innerHeight();

			// Do not center index, as it is already within current viewport.
			// Only adjust position, if it is only partly visible.
			var scrollTop = -1;
			if(offset + settings.trHeight > windowTop + windowHeight) {
				scrollTop = Math.max(0, offset - (windowHeight - settings.trHeight));
			} else if(offset < windowTop ) {
				scrollTop = offset;
			}
			if(scrollTop >= 0) {
				that.scrollTop(scrollTop);	
			}
			window.setTimeout(resolve, 16);			
		});
	};
	
	
	/*
	 * Restart table drawing at a given index.
	 * The index will be centered.
	 */
	const restart = function(index) {
		return start(index, false).then(function() {
			return center(index);
		}).then(onUpdate);
	};
	

	
	/*
	 * ******************************************
	 * *****    Event- (State-) Handlers    *****
	 * ******************************************
	 */
	
	/*
	 * Update the set of rendered rows based on the current scroll position.
	 * This function should be called every time the scroll position changes.
	 */
	const onUpdate = function() {
		
		const targetWindow = calcTargetWindow();
		const currentWindow = calcCurrentWindow();

		if(targetWindow.top > currentWindow.bottom || targetWindow.bottom < currentWindow.top) {
			// targetWindow does not intersect with currentWindow
			// -> restart at targetWindow's center
			return stateMachine.trigger(TableAction.RESET).then(restart(targetWindow.center));
		}
		
		// else:
		var animations = [];
		if(targetWindow.bottom >= currentWindow.bottom) {
			// more rows at the bottom of the table are needed
			animations.push(build(
					() => nextIter.next(columnVisibility),
					(targetWindow) => (stateMachine.getState() != TableState.RESETING) && nextIter.hasNext() && nextIter.getCurrent() <= targetWindow.bottom,
					html => {
						settings.appendFn(html);
						table.css({'margin-bottom': (settings.data.length - nextIter.getCurrent()) * settings.trHeight});
						if(settings.debug) {
							console.log('[jQuery.Lazytable] bot +' + html.length + ' rows');
						}								
					})
			);
		}
		if(targetWindow.top < currentWindow.top) {
			// more rows at the top of the table are needed
			animations.push(build(
					() => prevIter.prev(columnVisibility),
					(targetWindow) => (stateMachine.getState() != TableState.RESETING) && prevIter.hasPrev() && prevIter.getCurrent() > targetWindow.top,
					html => {
						settings.prependFn(html.reverse());
						table.css({'margin-top': prevIter.getCurrent() * settings.trHeight});
						if(settings.debug) {
							console.log('[jQuery.Lazytable] top +' + html.length + ' rows');
						}								
					})
			);				
		}
		
		if(animations.length > 0) {
			return stateMachine.trigger(TableAction.SCROLL, () => {
				return Promise.all(animations).then(() => {
					if(!settings.keepExisting) {
						free();
					}
					if(typeof(settings.onRedraw) === 'function') {
						settings.onRedraw();
					}			
				});					
			}).then(() => {
				stateMachine.trigger(TableAction.SCROLL_COMPLETE);
			});				
		}
		
	};
	
	
	/*
	 * Focus an index - move it to the visible part of the window.
	 * If index is outside the current window, the table will be
	 * rebuilt with index being centered.
	 */
	const onFocus = function(index) {
		const currentWindow = calcCurrentWindow();
		focusedIndex = index;
		
		if(currentWindow.top <= index && index < currentWindow.bottom) {
			return stateMachine.trigger(TableAction.SCROLL, () => {
				return scrollTo(index);
			});
		}

		/*
		 * Else: If desired index is not within currently active area,
		 * the table will be rebuilt from scratch. 
		 */
		return stateMachine.trigger(TableAction.RESET).then(() => {
			return restart(index);
		});
	};
	
	
	/*
	 * Draw the first row in the table. settings.trHeight will be calculated 
	 * if desired and necessary.
	 */
	const start = function(index, calcTrHeight) {
		return stateMachine.trigger(TableAction.START, () => {
			return new Promise((resolve, reject) => {
				const finalize = function() {
					const paddingTop = index * settings.trHeight;
					const height = settings.trHeight * settings.data.length;
					const paddingBottom = height - paddingTop - settings.trHeight;
				
					table.css({
						'margin-bottom': paddingBottom,
						'margin-top': paddingTop,
					});
					
					resolve();
				};
				
				// remove all table elements
				settings.deleteFn(0);
				
				// start at element to be focused
				nextIter.setCurrent(index);
				prevIter.setCurrent(index);
				
				// insert new row
				if(nextIter.hasNext()) {
					settings.appendFn([nextIter.next(columnVisibility)]);
					if(calcTrHeight) {
						/*
						 * Height calculation: After insterting the first row,
						 * we wait for it to get drawn. When it is ready, we
						 * use the first row's height to calculate margins.
						 */
				
						waitForRow().then(
							(row) => {
								const cs = window.getComputedStyle(row);
								const cssHeight = cs.getPropertyValue('height');
								const matches = cssHeight.match(/([\.\d]+)px/);
					
								if(matches) {
									settings.trHeight = parseFloat(matches[1]);
								} else {
									settings.trHeight = row.offsetHeight;
								}
							},
							() => {
								if(settings.debug) {
									console.log('[jQuery.Lazytable] start table draw failed due to rejected row promise');
								}
							}).then(finalize);
					} else {
						finalize();
					}
				} else {
					finalize();
				}			
			});			
		});
	};
	
	
	/*
	 * Restore table after table window div has been resized.
	 */
	const onResize = function() {
		return waitForRow().then(
			(row) => {
				const cssHeight = window.getComputedStyle(row).getPropertyValue('height');
				var matches;
				const height = (matches = cssHeight.match(/([\.\d]+)px/)) ? parseFloat(matches[1]) : row.offsetHeight;
			
				if((height > 0) && (height != settings.trHeight)) {
					// height has changed
					settings.trHeight = height;
				
					const startIndex = focusedIndex ? focusedIndex : Math.min(Math.floor((prevIter.getCurrent() + nextIter.getCurrent()) / 2), settings.data.length -1);
				
					return restart(startIndex);
				}
			
				if(focusedIndex) {
					// height has not changed, but focuse row 
					// might have gone out of visible area
					return onFocus(focusedIndex);
				}			
			},
			() => {
				if(settings.debug) {
					console.log('[jQuery.Lazytable] Resize failed due to rejected row promise');					
				}
			}
		);
	};
	
	
	/*
	 * Start all up.
	 */
	const init = function() {
		if(settings.debug) {
			stateMachine.onStateChange((oldState, newState) => {
				console.log('[jQuery.Lazytable] State change: ' + oldState + ' -> ' + newState);
			});
			stateMachine.onStateEnter(TableState.IDLE, () => {
				const n = nextIter.getCurrent() - prevIter.getCurrent();
				const marginTopStr = table.css('margin-top');
				const marginTop = parseInt(marginTopStr.substr(0, marginTopStr.length - 2));
				const marginBotStr = table.css('margin-bottom');
				const marginBot = parseInt(marginBotStr.substr(0, marginBotStr.length - 2));
				console.log('[jQuery.Lazytable] nVisible: ' + n);
				console.assert(((marginTop + marginBot) == (settings.data.length - n) * settings.trHeight), {
					"message": "margin claculation wrong",
					"nTotal": settings.data.length, 
					"nVisible": n,
					"top": marginTop,
					"bottom": marginBot,
					"trHeight": settings.trHeight
				});
			});
		}
		
		
		// Add descriptive classes to the table's DOM element based on the
		// current state (the state machine's state):
		//  - class "empty" is set in state "empty"
		//  - class "loading" is set in any state other than "empty" or "idle"
		table.addClass('empty'); // no rows added yet -> inital state is "EMPTY"
		stateMachine.onStateLeave(TableState.EMPTY, () => {
			table.removeClass('empty');
			table.addClass('loading');
		});
		stateMachine.onStateEnter(TableState.IDLE, () => {
			table.removeClass('loading');
		});
		stateMachine.onStateLeave(TableState.IDLE, () => {
			table.addClass('loading');
		});
		
		
		// remove old event handlers
		that.off('scroll');
		that.off('lazytable:focus');
		that.off('lazytable:resize');

		
		// Temporarily setting the overflow property to 'hidden'
		// during initialisation fixes a bug related to scrollTop 
		// being unchangeable.
		// See: https://code.google.com/p/android/issues/detail?id=19625#c25
		that.css({'overflow-y': 'hidden'});

		const finalize = () => {
			// reset overflow to 'scroll'
			that.css({'overflow-y': 'scroll'});

			if(typeof(settings.onInit) == 'function') {
				settings.onInit();
			}

			// add event handlers
			that.on('scroll', function() {
				// use an animationFrame to prevent from scroll-linked effects
				window.requestAnimationFrame(onUpdate);
			});
			that.on('lazytable:focus', function(event, index, callback) {
				onFocus(index).then(function() {
					if(typeof(callback) === 'function') {
						callback();
					}
				});
			});
			that.on('lazytable:resize', function() {
				if(!resizeAnimationWorking && settings.data.length > 0) {
					resizeAnimationWorking = true;
					onResize().then(onUpdate).finally(function() {
						resizeAnimationWorking = false;
					});
				}
			});		
		};
		
		if(settings.data.length > 0) {
			start(settings.startIndex, true).then(function() {
				return center(settings.startIndex);
			}).then(onUpdate).then(finalize);			
		} else {
			// stay in empty state
			finalize();
		}
	};
	setFixedHead();
	tableColumnToggle();
	//console.log('columnVisibility',columnVisibility);
	init();
	
	
	
	setSearchInput();
	return settings;
}