const resizeObserver = new ResizeObserver(entries => {
		
    //setFontSize();
    for (let entry of entries) {
        
        var clone=$(entry.target).jqmData('clone');
        if($(clone).width()!=$(entry.target).width())
        //console.log('Element width changed to: ' + $(entry.target).width(),$(clone).width(),entry.target);
            $(clone).css('width',$(entry.target).width());
        
    }
    
});


const setFixedHead = function(target,fixed) {
    //console.log('thead',table.find('thead'));
    var _Header=$(target).find('thead').clone();
    //var _table_fixed=$('<table data-role="table" class="ui-responsive table-stroke fixed-header" style="margin: 0px 0px;text-shadow: none;width: 100%;position: fixed;z-index:100;"></table>');
    _Header.css({'background': '#262626',color:'white'})
    fixed.append(_Header);
    //that.prepend(_table_fixed);
    fixed.trigger('create');
    //_table_fixed.hide();
    //that.trigger('create');
    var _ths=fixed.find('thead').find('th');
    $.each($(target).find('thead').find('th'),(index,th)=>{
        $(th).jqmData('clone',_ths[index]);
        if(index==_ths.length-1) {
            var columnToggler=$('<i class="fa fa-gear"></i>');
            $(_ths[index]).empty();
            $(_ths[index]).removeClass('table-column-toggle');
            $(_ths[index]).append(columnToggler);
            $(_ths[index]).addClass('table-column-toggle');
            //console.log('isNormal',($(ref_ths[index]).outerWidth()/window.innerWidth>0.1),$(ref_ths[index]).outerWidth(),window.innerWidth);
            //resizeTables($(ref_ths[index]).outerWidth()/window.innerWidth>0.1,true);
        }
        resizeObserver.observe(th);
    });

    
    //headResizeObserver.observe(_Header.get( 0 ));
}

function tableColumnToggle(columnTemplate,container,target){
    var ids=Object.keys(columnTemplate);
    var filterables={};
    var hiddenList={};
var duration=500;
    var filterBtn=container;
    var filterPopup=$('<div data-role="popup" id="'+target+'-columnFilter" data-theme="a" class="ui-corner-all"></div>');
    if(container instanceof String){
        filterBtn=$('<a href="#'+target+'-columnFilter" data-rel="popup" data-position-to="origin" class="ui-btn-right footerBtn ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-bullets ui-btn-icon-left ui-btn-a" data-transition="pop">列</a>');
        $("#"+container).append($(filterBtn));
        $("#"+container).append(filterPopup);
    }else{
        filterPopup.insertAfter(filterBtn);
        $(filterBtn).on('click',function(e){
            console.log($('#'+target+'-columnFilter'),e);
            $('#'+target+'-columnFilter').popup('open');
            $('#'+target+'-columnFilter').popup('reposition',{x:e.pageX,y:e.pageY});
        })
    }
    
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
        var columnData=columnTemplate[id];
        if(columnData.isFilterable){
            filterables[id]=columnData.label;
            hiddenList[id]=columnData.isHidden;
            var checked=!columnData.isHidden?" checked='checked'":"";
            var input=$('<input type="checkbox" name="'+id+'" id="'+id+'-column'+'"'+checked+'>');
            var label=$('<label for="'+id+'-column'+'">'+columnData.label+'</label>');
            filterFielset.append(input);
            filterFielset.append(label);
            input.on("click",function(e){
                //console.log( $('td[name="'+input.prop('name')+'"]'));
                setAvailableColumn(target,input,duration);
                saveChangedToUser(target);
                
            });
            if(columnData.isHidden){
                $("#"+target).find('th[name="'+id+'"]').hide(1);
                $("#"+target+"-fixed").find('th[name="'+id+'"]').hide(1);
                $("#"+target).find('td[name="'+id+'"]').hide(1);
            }
        }
        //hiddenList[columnData.label]=columnData.isHidden;
        //th.jqmData('isHidden',columnData.isHidden);
    });
    filterPopup.trigger('create');filterPopup.trigger('change');
    if(container instanceof String){
        $("#"+container).trigger('create');
    }
    return filterPopup;
}
function saveChangedToUser(target){
    target=getElementId(target);
    var checkboxs=$('#'+target+'-columnFilter').find('input[type="checkbox"]:checked');
    var checkedCols=[];
    $.each(checkboxs,(index,checkbox)=>{
        checkedCols.push($(checkbox).attr('name'));
    })
    //console.log(checkedCols);
    var userData=getCurrentUserSaved();
    userData.columns=checkedCols.join();
    userData.createDate=formatDateTimeStr2Mysql(userData.createDate);
    userData.lastLogin=formatDateTimeStr2Mysql(userData.lastLogin);
    saveCurrentUser(userData);
}
function setAvailableColumns(target,duration){
    target=target.replace('#','');
    var checkboxs=$('#'+target+'-columnFilter').find('input[type="checkbox"]');
    $.each(checkboxs,(index,checkbox)=>{
        setAvailableColumn(target,checkbox,duration);
    })
}
function setAvailableColumn(target,checkbox,duration){
    target=target.replace('#','');
    if(!$(checkbox).prop('checked')){
        $("#"+target).find('th[name="'+$(checkbox).prop('name')+'"]').hide(duration);
        $("#"+target+"-fixed").find('th[name="'+$(checkbox).prop('name')+'"]').hide(duration);
        $("#"+target).find('td[name="'+$(checkbox).prop('name')+'"]').hide(duration);
    }else{
        $("#"+target).find('th[name="'+$(checkbox).prop('name')+'"]').show(duration);
        $("#"+target+"-fixed").find('th[name="'+$(checkbox).prop('name')+'"]').show(duration);
        $("#"+target).find('td[name="'+$(checkbox).prop('name')+'"]').show(duration);
    }
}
function disableGlowing(e){
    $(this).removeClass('newItem');
    $(this).off('click',disableGlowing);
}
function pageTable(arg){
    this.opt={
        data:undefined,
        template:undefined,
        containerId:undefined,
        rowButtons:undefined,
    }
    this.init(arg)
}

pageTable.prototype.init=function(arg){
    var _this=this;
    extend(this.opt,arg);
    if(_this.opt.containerId==undefined || _this.opt.template==undefined) {
        console.log("args [data, template and containerId] have to be defined...");
        return;
    }
    
    _this.buildTableColumns(_this.opt.template);
    //console.log($("#"+_this.opt.containerId).html());
    
    if(_this.opt.data!=undefined) _this.addTableData(_this.opt.data);
    $("#"+_this.opt.containerId).table().table("refresh");
    $("#"+_this.opt.containerId).trigger("create");

    function extend(opt1,opt2){
        for(var attr in opt2){
            //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
            opt1[attr] = opt2[attr];
        }
    }
}
pageTable.prototype.setSort=function(ths){
    var _this=this;
    var ids=Object.keys(_this.opt.template);
    
    $.each(ids,function(index,id){
        var columnData=_this.opt.template[id];
        if(columnData.hasOwnProperty('sortable')){
            $(ths[index]).css({'cursor':'pointer'})
            var indicator=$('<i class="fa fa-caret-up" />');
            if(id!='id') indicator.hide();
            else
                _this.currentSort=columnData.sortable;
            $(ths[index]).append(indicator);
            $(ths[index]).on('click',function(e){
                
                //$().mloader("show",{message:"排序中...."});
                //sortColumn(columnData.sortable);
                _this.currentSort=columnData.sortable;
                $(ths).find('i').hide();
                var event=jQuery.Event("sort");
                event.value=columnData.sortable;
                columnData.sortable.isASC=!columnData.sortable.isASC;
                $("#"+_this.opt.containerId).trigger(event);
                $(this).find('i').show();
                if(columnData.sortable.isASC) {
                    $(this).find('i').removeClass('fa-caret-down').addClass('fa-caret-up');
                }else{
                    $(this).find('i').removeClass('fa-caret-up').addClass('fa-caret-down');
                }
            });
            
        }
    });
    
}
pageTable.prototype.buildTableColumns=function(){
    var _this=this;
    var columnTemplate=_this.opt.template;
    $("#"+_this.opt.containerId).find('thead').remove();
    if(!(columnTemplate instanceof Array)){
        //console.log('buildTableColumns...........');
        var thead=$('<thead></thead>');
        var tr=$('<tr></tr>');
        thead.append(tr);
        var ids=Object.keys(columnTemplate);
        $.each(ids,function(index,id){
            var columnData=columnTemplate[id];
            var ws=columnData.width!=undefined?" style='width:"+(Number(columnData.width)?columnData.width+"px;'":columnData.width+"'"):"";
            var th;
            //console.log(id+": "+ws);
            if(columnData.type=="checkbox"){
                th=$('<th'+ws+' name="'+id+'"><input class="reg-checkbox-all" type="checkbox" data-mini="true"></th>');
            }else{
                if(columnData.isFilterable){
                    th=$(`<th${ws} name="${id}" data-priority="1">${columnData.label}</th>`);
                }else{
                    th=$(`<th name="${id}">${columnData.label}</th>`);
                }
    
            }
            
            tr.append(th);
            //th.jqmData('isHidden',columnData.isHidden);
        });
        
        $("#"+_this.opt.containerId).append(thead);
    }else{
        var thead=$('<thead></thead>');
        var tr=$('<tr></tr>');
        tr.hide();
        thead.append(tr);
        $("#"+_this.opt.containerId).append(thead);
    }
    

}
pageTable.prototype.updateTableData=function(data,tr){
    var _this=this;
    var columnTemplate=_this.opt.template;
    var dataKeys=Object.keys(data);
    //console.log('updateTableData',$(tr).find('td'));
    $.each($(tr).find('td'),(index,td)=>{
        var id=$(td).attr('name');
        //console.log('updateTableData',id,dataKeys.includes(id));
        if(dataKeys.includes(id)){
            var newTd=getTdElement(columnTemplate[id],data[id],id,_this);
            $(newTd).css({'display':$(td).css('display')});
            $(td).before(newTd);
            $(td).remove();
        }
    })
    _this.pageTable('refresh');
}
pageTable.prototype.restoreTableItem=function(callback){
    var _this=this;
    var duration=200;
    var targetTable=$("#"+_this.opt.containerId)
    var trs=$(targetTable).find('input[type="checkbox"][name="item_checkbox"]:checked').closest('tr');
    
    var ids=[];
    // Remove the tr element after the animation completes
    $(trs).removeClass('inactived-row');
    $.each(trs,(index,tr)=>{
        ids.push($(tr).data('item'));
        var checkbox=$(tr).find("input[type=checkbox][name=item_checkbox]");
        if(checkbox.length>0){
            checkbox.prop('checked',false);
        }
    })
    const intervalId = setInterval(() => {
        if (ids.length==trs.length) {
            clearInterval(intervalId);
            if(callback!=undefined) callback(ids);
            
        }
    }, 100);
}
pageTable.prototype.removeTableItem=function(auth,callback){
    var _this=this;
    var duration=200;
    var targetTable=$("#"+_this.opt.containerId)
    var trs=$(targetTable).find('input[type="checkbox"][name="item_checkbox"]:checked').closest('tr');
    
    var ids=[];
    // Remove the tr element after the animation completes
    console.log('auth',auth);
    if (auth<3){
        trs.addClass('slip-left-out');
        trs.on('animationend', function() {
            ids.push($(this).data('item'));
            
            $(this).find('td').animate({
                'padding-top': 0,
                'padding-bottom':0,
                }).wrapInner('<div />').children().slideUp(duration,function() {
                    $(this).closest('tr').remove();
                    
                });
        });
    }else{
        $(trs).addClass('inactived-row');
        $.each(trs,(index,tr)=>{
            ids.push($(tr).data('item'));
            var checkbox=$(tr).find("input[type=checkbox][name=item_checkbox]");
            if(checkbox.length>0){
                checkbox.prop('checked',false);
            }
        })
    }
    const intervalId = setInterval(() => {
        if (ids.length==trs.length) {
            clearInterval(intervalId);
            if(callback!=undefined) callback(ids);
            
        }
    }, 100);
}
pageTable.prototype.insertTableData=function(data,isLastPosition){
    var _this=this;
    var tbody=$("#"+_this.opt.containerId).find('tbody');
    var columnTemplate=_this.opt.template;
    var dataKeys=Object.keys(data);
    var tr=$('<tr data-item='+data.id+'></tr>');
    //console.log('updateTableData',$(tr).find('td'));
    $.each(columnTemplate,(id,settings)=>{
        //console.log('updateTableData',id,dataKeys.includes(id));
        //if(dataKeys.includes(id)){
            var td=$('<td></td>');
            if(data.hasOwnProperty(id)){
                    
                td=getTdElement(columnTemplate[id],data[id],id,_this);
                
            }else{
                //console.log("id.........."+d.id);
                td=getTdElement(columnTemplate[id],data.id,id,_this);
            }
            $(tr).append(td);
            console.log('isHidden',id,settings.isHidden);
            if(settings.isFilterable && settings.hasOwnProperty('isHidden') && settings.isHidden) $(td).hide();
        //}
    })
    //console.log('scrollTop height',$("#"+_this.opt.containerId).height());
    if(isLastPosition)
        tbody.append(tr);
    else
        tbody.prepend(tr);
    $(tr).addClass('newItem');
    $(tr).on('click',disableGlowing)
    _this.pageTable('refresh');
    setTimeout(() => {
        //console.log('scrollTop height1',$("#"+_this.opt.containerId).height());
        var table=$("#"+_this.opt.containerId);
        var tableHeight = table.height();
        //console.log($(tr).offset(),tableHeight);
        //var pageHeight = $(window).height();
        //var scrollAmount = tableHeight - pageHeight;
        //console.log('scrollTop',scrollAmount);
        if(isLastPosition)
            $("html, body").animate({ scrollTop: $(tr).offset().top+$(tr).height()}, 1000);
        else
            $("html, body").animate({ scrollTop: 0}, 1000);
    }, 500);
}
pageTable.prototype.addTableData=function(data,isAdd){
    var _this=this;
    var columnTemplate=_this.opt.template;
    //console.log('add new tbody: ',$("#"+_this.opt.containerId).find('tbody'))
    var tbody=$("#"+_this.opt.containerId).find('tbody');
    if(!isAdd){
        tbody.remove();
        tbody=$('<tbody></tbody>');
    }
    
    
    //console.log('data instanceof Array');
    //console.log(data instanceof Array);
    //console.log(data);
    //console.log('data instanceof Array');
    if(!(data instanceof Array)){
        //console.log('data instanceof Array');
        //console.log(data);
        var collect={};
        var mergedData=[];
        $.each(data,(index,d)=>{
            $.each(d,(id,val)=>{
                if(!collect.hasOwnProperty(id)) collect[id]=[];
                collect[id].push(val);
            })
            //mergedData=Object.assign({}, mergedData,d);
        });
        //console.log(collect);
        $.each(collect,(id,vals)=>{
            var merge={};
            $.each(vals,(index,val)=>{
                merge=Object.assign({}, merge,val);
            });
            mergedData.push(merge);
        })
        //console.log('mergedData');
        //console.log(mergedData);
        data=mergedData;
    }
    
    if(!(columnTemplate instanceof Array)){
        var ids=Object.keys(columnTemplate);
    
        $.each(data,function(i,d){
            var tr=$('<tr data-item='+d.id+'></tr>');
            $.each(ids,function(index,id){
                var td;
                if(d.hasOwnProperty(id)){
                    
                    td=getTdElement(columnTemplate[id],d[id],id,_this);
                    
                }else{
                    //console.log("id.........."+d.id);
                    td=getTdElement(columnTemplate[id],d.id,id,_this);
                }
                tr.append(td);
            })
            if(isAdd){
                tr.hide();
                tbody.prepend(tr);
            }else
                tbody.append(tr);
            if(d.isInactived){
                //tr.prop('disabled',true);
                tr.addClass('inactived-row');
            }
            setTimeout(() => {
                
                tr.slideDown();
            }, 500);
            
        });
    }else{
        $.each(data,function(i,d){
            var tr=$('<tr data-item='+d.id+'></tr>');
            columnTemplate.forEach(template => {
                if(template.hasOwnProperty('data')){
                    var ids=Object.keys(template.data);
                    var ws=template.width!=undefined?" style='width:"+(Number(template.width)?template.width+"px;'":template.width+"'"):"";
                    
                    var td=$('<td'+ws+'></td>');
                    var columnTemplate=[];
                    $.each(ids,function(index,id){
                        if(index==ids.length-1){
                            columnTemplate.push("1fr");
                        }else{
                            columnTemplate.push("auto");
                        }
                        
                    });
                    var gridStyle=' style="display:grid;grid-template-columns:'+columnTemplate.join(" ")+';"';
                    if(ids.length==1) gridStyle="";
                    var labelValueContainer=$('<div'+gridStyle+'></div>');
                    td.append(labelValueContainer);
                    $.each(ids,function(index,id){
                        
                        
                        if(template.data[id].type=="backgroundColorLabel" && template.data[id].hasOwnProperty('backgroundData') && template.data[id].backgroundData!=undefined){
                            //console.log(id,template.data[id]);

                            //console.log('backgroundData: '+template.data[id].backgroundData[template.data[id].data[d[id]]]+"--"+template.data[id].data[d[id]]);
                            td.css(template.data[id].backgroundData[template.data[id].data[d[id]]])
                        }
                        if(template.data[id].hasOwnProperty('label')){
                            var label=$('<label>'+template.data[id].label+'</label>');
                            if(template.data[id].style!=undefined) label.css(template.data[id].style);
                            labelValueContainer.append(label);
                        }
                        if(d.hasOwnProperty(id)){
                            //console.log('d.hasOwnProperty');
                            //console.log(template.data[id]);
                            //console.log(d[id]);
                            
                            labelValueContainer.append($(getTdElement(template.data[id],d[id],id,_this).html()));
                        }else{
                            //console.log(template.data[id]);
                            labelValueContainer.append($(getTdElement(template.data[id],d.id,id,_this).html()));
                        }
                    });
                    
                    tr.append(td);
                };
            });
            tbody.append(tr);
        });
    }
    
    //console.log(tbody);
    $("#"+_this.opt.containerId).append(tbody);
    $("#"+_this.opt.containerId).trigger('create');
    
}
pageTable.prototype.pageTable=function(command,data){
    var _this=this;
    if(command=="refresh"){
        $("#"+_this.opt.containerId).table().table("refresh");
        $("#"+_this.opt.containerId).trigger("create");
    }else if(command=="create"){
        _this.buildTableColumns();
        _this.addTableData(data);
        tableColumnToggle(_this.opt.template,"mainFooter",_this.opt.containerId);
        //console.log('pageTable data:',data);
        //$("#"+_this.opt.containerId).find('tbody').remove();
        $("#"+_this.opt.containerId).table().table("refresh");
        $("#"+_this.opt.containerId).trigger("create");
        
        $("#"+_this.opt.containerId).hpaging({ limit: 10 });
       // console.log($("#"+_this.opt.containerId).html());
    }
}
function _createNewCaseForm(template, constainerId){
    
    //console.log("_createNewCaseForm template");
    //console.log(template);
    var main_form= new mform({template:template});
    var form=main_form.instance;
    
    const popup_form = document.getElementById(constainerId);
    $(popup_form).append(form);
    $(constainerId).trigger('create');


    return main_form;
}
function getTdElement(columnSettings,value,key,_this){
    var td=$('<td name="'+key+'"></td>');
    if(columnSettings.style!=undefined) td.css(columnSettings.style);
    if(columnSettings.type=="checkbox"){
        var item=$('<input class="reg-checkbox" type="checkbox" data-mini="true" name="item_checkbox" data-item='+value+'>');
        //console.log('<input class="reg-checkbox" type="checkbox" data-mini="true" name="item_checkbox" data-item='+value+'>');
        td.append(item);
    }else if(columnSettings.type=="buttons"){
        if(_this.opt.rowButtons!=undefined){
            td.append($(formatString(_this.opt.rowButtons,value)));
        }else{
            if(columnSettings.data!=undefined){
                var container=$('<div data-role="controlgroup" data-mini="true" data-type="horizontal"></div>');
                columnSettings.data.forEach(but=>{
                    var cls="";
                    var text="";
                    if(but.hasOwnProperty('clss')){
                        cls=but.clss;
                    }
                    if(but.hasOwnProperty('label')){
                        text=but.label;
                    }
                    var href=but.hasOwnProperty('href')?but.href:"#";
                    var btn=$('<a href="'+href+'" data-index="'+value+'" class="table-fn-btn ui-btn ui-corner-all ui-shadow '+cls+'">'+text+'</a>');
                    container.append(btn);
                    
                    //console.log(container.html());
                })
                td.append(container);
            }
        }
    }else if(columnSettings.type=="date"){
        //console.log('table date value',value);
        val=getDateTime(value);

        //console.log('table date value formated',v);
        if(columnSettings.dateFormat!=null) val=formatDateTime(new Date(value),columnSettings.dateFormat);
        if(value=='0000-00-00 00:00:00'){
            val="尚未设定";
        }
        
        var label=$('<label>'+val+'</label>')
        td.append(label);
    }else if(columnSettings.type=="backgroundColorLabel"){
        var val=value;
        if(columnSettings.data!=undefined){
            val=columnSettings.data[val];
        }
        var label=$('<label>'+val+'</label>')
        
        //console.log('backgroundData',columnSettings.backgroundData,val);
        if(columnSettings.hasOwnProperty('backgroundData')&&columnSettings.backgroundData.hasOwnProperty(val) ){
            td.css(columnSettings.backgroundData[val]);
        }
        td.append(label);
    }else if(columnSettings.type=="supermulticombobox"){
        var vals=value.split(',');
        var multiValues=[];
        vals.forEach(_v=>{
            //console.log(key,_v);
            var _values=formatSuperMultiSelectOptionValue(_v);
            //console.log('setSumList',_values);
            if(columnSettings.hasOwnProperty('displayFormat')){
                var displayFormat=columnSettings.displayFormat;
                $.each(_values,(kk,vv)=>{
                    if(displayFormat.indexOf(kk)>-1){
                        displayFormat=displayFormat.replace("{"+kk+"}",vv);
                    }
                })
                multiValues.push(displayFormat);
            }else{
                var collector=[];
                $.each(_v,(kk,vv)=>{
                    collector.push(vv);
                })
                multiValues.push(collector.join(" "));
            }
        });
        var label=$('<label>'+multiValues.join("<br/>")+'</label>');
        label.setTooltip();
        td.append(label);
    }else if(columnSettings.type=="supermultiinput"){
        var vals=value.split(',');
        var multiValues=[];
        vals.forEach(_v=>{
            var _values=formatSuperMultiSelectData(_v);
            //console.log('setSumList',_values);
            if(columnSettings.hasOwnProperty('displayFormat')){
                var displayFormat=columnSettings.displayFormat;
                $.each(_values,(kk,vv)=>{
                    if(displayFormat.indexOf(kk)>-1){
                        displayFormat=displayFormat.replace("{"+kk+"}",vv);
                    }
                })
                multiValues.push(displayFormat);
            }else{
                var collector=[];
                $.each(_v,(kk,vv)=>{
                    collector.push(vv);
                })
                multiValues.push(collector.join(" "));
            }
        });
        var label=$('<label>'+multiValues.join("<br/>")+'</label>');
        label.setTooltip();
        td.append(label);
    }else if(columnSettings.type=="progresses"){
        var val=value;
        if(columnSettings.data!=undefined){
            var index=formatIndex(val);
            //console.log('val....');
            val=columnSettings.data[index.main];
            //console.log(columnSettings.data);
            if(val instanceof Array){
                val=val[index.sub];
                //console.log(val);
            }
        }
        if(val==undefined) val='未开始流程';
        var label=$('<label>'+val+'</label>')
        td.append(label);
    }else if(columnSettings.type=="progressesButton"){
        var but=new ProgressesButton({
            steps:progresses,
            deadSteps:deads,
            showLabel:true,
            //containerId:'#'+pbut.id,
            currentPosition:Number(value),
            fontSize:12,
            line_size:4,
            size:12,
            width:240,
            isViewMode:true,
            verticalGap:2,
            labelPosition:"bottom",
            showSubSteps:false,
            readOnly:true,
          });
          td.append(but.instance);
          but.instance.css({'margin-top':"-25px"})
    }
    else{ //if(columnSettings.type=="label"){
        var val=value;
        if(columnSettings.data!=undefined){
            if(columnSettings.valueKey!=undefined && 
                columnSettings.matchKey!=undefined){
                    //console.log(columnSettings.data);
                    var itemD=columnSettings.data.filter((_itemD)=>{return _itemD.hasOwnProperty(columnSettings.matchKey) && _itemD[columnSettings.matchKey]==val});
                    if(itemD.length>0 && itemD[0].hasOwnProperty(columnSettings.valueKey)){
                        val=itemD[0][columnSettings.valueKey];
                    }
                
            }else{
                val=columnSettings.data[val];
            }
            
        }
        if(value==null) val="尚未设定";
        var label=$('<label>'+val+'</label>')
        td.append(label);
    }
    if(columnSettings.isHidden) td.hide();
    if(columnSettings.style!=undefined) td.children().css(columnSettings.style);
    return td;
}
pageTable.prototype.sortColumn=function(data,columnData){
    if (columnData.type=='number') {
        if(!columnData.isASC){
            data=data.sort(function(a,b){return b[columnData.id]-a[columnData.id]});
        }else{
            data=data.sort(function(a,b){return a[columnData.id]-b[columnData.id]});
        }
        
    }else if (columnData.type=='date') {
        if(!columnData.isASC){
            data=data.sort(function(a,b){return new Date(b[columnData.id])>new Date(a[columnData.id])});
        }else{
            data=data.sort(function(a,b){return new Date(a[columnData.id])>new Date(b[columnData.id])});
        }
    }
    //console.log(data);
    this.addTableData(data);
}