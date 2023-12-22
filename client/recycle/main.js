var main_form,pageOnTable,pageSeTable;
//$.mobile.page.prototype.options.domCache = true;
//$.mobile.changePage.defaults.reloadPage = true
$.mobile.navigate('#');
var canvas=document.getElementById('myCanvas');
eventManager.setCanvas(canvas);
setGlobal('currentPage',"#page1");
//window.location.href = 'text.html';
$('body').on(preload_completed_event_name,function(){
	formatCasesData(DataList.casesDb);
	main_form=_createNewCaseForm(FormTemplate3,"case_reg_page");
	//console.log("datalist: ",getGlobalJson("datalist"));
	_firstPageTableColumns.caseApplicant.data=DataList.userList;

	pageOnTable=new pageTable({
		containerId:"pageOneTable",
		template:_firstPageTableColumns,
		data:DataList.combinedData,
		//filterParent:"mainFooter",
		rowButtons:'<div data-role="controlgroup" data-type="horizontal" data-mini="true">'+
			'<a href="#timeline" name="fn_btn_details" class="ui-btn btn-icon-green ui-icon-eye ui-btn-icon-notext" data-transition="slidefade" data-item={0}>查看</a>'+
			'<button href="#fullscreenPage" name="fn_btn_edit" class="btn-icon-blue" data-icon="edit" data-iconpos="notext" data-item={0}>修改</button>'+
			'<button name="fn_btn_delete" class="btn-icon-red" data-icon="delete" data-iconpos="notext" data-item={0}>删除</button>'+
		'</div>'
	});
	//添加表格的索引按钮
	tableColumnToggle(_firstPageTableColumns,"mainFooter","pageOneTable");

	pageSeTable=new pageTable({
		containerId:"pageSecondTable",
		template:_progressTableTemplate,
		data:DataList.combinedData
		//filterParent:"mainFooter",
	});

	addClickEvents();

	$("#pageOneTable").fancyTable({
		/* Column number for initial sorting*/
		 sortColumn:0,
		 /* Setting pagination or enabling */
		 pagination: true,
		 /* Rows per page kept for display */
		 perPage:10,
		 globalSearch:true
		 });
	
		 $("#pageSecondTable").hpaging({ limit: 10 });
	$.each($("#pageOneTable-popup [type=checkbox]"),function(index,checkbox){
		if(index<2){
			$(checkbox).prop("checked", false)            /* uncheck it */
						.checkboxradio("refresh")          /* refresh UI */
						.trigger("change");
								}
	});

	$('#main-container').addClass('hide');
	$('#mainFooter').show();
	logingStatus();
});


$(".nav-but").on("click",function(e){
	//e.preventDefault();
	if(getGlobal('currentPage') == $(this).attr( "href" )) return;
	$(getGlobal('currentPage')).addClass('hide');
	$($(this).attr( "href" )).removeClass('hide');
	$(getCurrentPageTabBtn(getGlobal('currentPage'))).removeClass('tab-active');
	$(this).addClass('tab-active');
	$(this).find('h2').css({'font-szie':'30px','font-weight':"700"})
	//$(this).parent().addClass('tab-active');
	//currentPage=$(this).attr( "href" );
	setGlobal('currentPage',$(this).attr( "href" ));
	if(getGlobal('currentPage')!="#page1"){
		$('#searchbar1').animate({'margin-left':"120px",'margin-right':"10px"});
		$('.footerBtn').hide();
		$('#mainFooter').find('input[type="checkbox"]').removeClass('hide');
		$('.ui-footer-btns').animate({'margin-left':'38px'});
		//$('#search_panel').removeClass('hide');
	}else{
		$('#searchbar1').animate({'margin-left':"210px",'margin-right':"80px"},function(){
			$('.footerBtn').show();
			$('#mainFooter').find('input[type="checkbox"]').addClass('hide');
			$('.ui-footer-btns').animate({'margin-left':'10px'},function(){
				
			});
			//$('#search_panel').addClass('hide');
		});
		
	}
	$("#pageSecondTable").jqmData('filter',getGlobal('currentPage')=="#page2");
	$("#pageOneTable").jqmData('filter',getGlobal('currentPage')=="#page1");			
});
$("#progress_popupMenu").popup({
	afterclose:function(event,ui){
		$(this).find('[data-role="collapsible"]').collapsible({
			collapsed: true
			});
	}
})
function getCurrentPageTabBtn(pageId){
	var btns=$('#main_nav').find('button[href="'+pageId+'"]');
	if(btns.length>0) return btns[0];
	return undefined;
}
function logingStatus(){
	//setGlobalJson("currentUser","{}");
	if(getGlobalJson("currentUser") && getGlobalJson("currentUser").name){
		$('#name').text(getGlobalJson("currentUser").name);
		
	}else{
		$().minfo('show',{title:"错误",message:"自动跳转到登录页面？"});
		setTimeout(function() {
			window.location.href = 'index.html';
		}, 2000);
	}
}
function formatCasesData(data){
	$.each(data,(index,cas)=>{
		var personnel=cas['casePersonnel'];
		var case2ndParty=cas['case2ndParty'];
		var val=[];
		var case2ndPartyVal=[];
		//case2ndPartyVal=convertOldData(case2ndParty,casePersonnelStatus);
		if(case2ndParty.indexOf('；')>-1 || case2ndParty.indexOf('、')>-1|| case2ndParty.indexOf('(')>-1|| case2ndParty.indexOf('（')>-1){
			var sencodParty=[];
			if(case2ndParty.indexOf('；')>-1)
				sencodParty=case2ndParty.split('；');
			else if(case2ndParty.indexOf('、')>-1)
				sencodParty=case2ndParty.split('、');
			else
				sencodParty=[case2ndParty];
			
			$.each(sencodParty,(index,party)=>{
				if(party.length>0){
					var party_data=party.split('(');
					if(party.indexOf('（')>-1){
						party_data=party.split('（');
					}
					var party_name="";
					var party_status="无";
					var party_status_id=0;
					if(party_data.length>1){
						party_name=party_data[0];
						party_status=party_data[1].replace(')','').replace('）','');
						party_status_id=casePersonnelStatus.indexOf(party_status);
	
					}else if(party_data.length==1){
						party_name=party_data[0];
					}
					
					if(party.indexOf('（')>-1){
						//console.log('format data special',party_status_id+party_name,party_data);
					}
					case2ndPartyVal.push(party_status_id+party_name);
				}
				
			});
		}else{
			if(isNaN(parseInt(case2ndParty[0]))){
				case2ndPartyVal.push(0+case2ndParty);
			}
		}
		if(personnel.indexOf('；')>-1 || personnel.indexOf('、')>-1 || personnel.indexOf('(')>-1|| personnel.indexOf('（')>-1){
			//console.log("format data special--------------",cas['id'],personnel);
			personnel=personnel.replace('（北京）','');
			var peronnels=[];
			if(personnel.indexOf('；')>-1)
				peronnels=personnel.split('；');
			else if(personnel.indexOf('、')>-1)
				peronnels=personnel.split('、');
			else
				peronnels=[personnel];
			$.each(peronnels,(index,peronnel)=>{
				if(peronnel.length>0){
					var _data=peronnel.split('(');
					if(peronnel.indexOf('（')>-1){
						_data=peronnel.split('（');
					}
					var _name="";
					var _nameId=0;
					var _status="无";
					var _status_id=0;
					var _group="";
					var _group_id=0;
					
					if(_data.length>1){
						if(!isNaN(parseInt(_data[0]))){

						}else{
							_name=_data[0];
							_status=_data[1].replace(')','').replace('）','');
							_status_id=casePersonnelStatus.indexOf(_status);
							

						}
	
					}else if(_data.length==1){
						//console.log("format data special--------------",cas['id'],_status_id);
						_name=_data[0];
					}
					$.each(corporate_companies,(index,company)=>{
						if(_name.indexOf(company)>-1){
							_group='公司';
							_nameId=index;
							_group_id=0;
						}
						
					});
					$.each(corporate_partners,(index,partner)=>{
						if(_name.indexOf(partner)>-1){
							_group='个人';
							_nameId=index;
							_group_id=1;
						}
						
					});
					
					val.push(_status_id+_group+_nameId);
				}
			});
			/*
			//console.log(peronnels);
			$.each(corporate_companies,(index,company)=>{
				//console.log(company+"--"+peronnels.filter(p => p.indexOf(company)>-1));
				peronnels.forEach((p)=>{
					if(p.indexOf(company)>-1){
						//console.log(index+"--"+company);
						val.push('公司'+index);
					}
				})
			});
			$.each(corporate_partners,(index,partner)=>{
				//console.log(company+"--"+peronnels.filter(p => p.indexOf(company)>-1));
				peronnels.forEach((p)=>{
					if(p.indexOf(partner)>-1){
						//console.log(index+"--"+partner);
						val.push('个人'+index);
					}
				})
			});
			*/
		}
		
		//console.log("format data",cas['id'],cas['casePersonnel'],val.join(','));
		if(val.length>0){
			cas['casePersonnel']=val.join(',');
		}
		if(case2ndPartyVal.length>0){
			cas['case2ndParty']=case2ndPartyVal.join(',');
		}
		//cas['isReadOnly']=true;
		//cas['isReadOnly']=true;
		//console.log('caseDate',cas['id'],cas['caseDate']);
		cas['caseDate']=getDateTime(cas['caseDate']);
		cas['caseCreateDate']=getDateTime(cas['caseCreateDate']);
		cas['appealAmount']=0.00;
		cas['requestAmount']=0.00;
		cas['caseCounterclaimRequest']="";
		cas['caseLawsuitRequest']="";
		console.log("format data",cas['id']+"---"+case2ndPartyVal.join(','),val.join(','));
		//insert('cases',cas,(e)=>{
			//console.log(e);
		//})	
		if(cas.id>30){
			//delete cas.caseStatus;
			delete cas.lawFirm;
			delete cas.legalAgencies;
			delete cas.legalCounsel;
			delete cas.legalInstitution;
			delete cas.paidAmount;
			delete cas.penalty;
			delete cas.requestAmount;
			delete cas.attorney;
			delete cas.FirstInstance;
			delete cas.SecondInstance;
			var status_data={
				id:cas.id,
				caseNo:cas.caseNo,
				//caseStatus:cas.id<67?1.0:3.1,
				caseStatus:cas.caseStatus==2||cas.caseStatus==4.1?cas.caseStatus-1:cas.caseStatus,
				//legalAgencies:1,
				//lawFirm:0,
				//attorney:"无0",
				FirstInstance:'0000-00-00 00:00:00',
				SecondInstance:'0000-00-00 00:00:00',
				//legalCounsel:"无0",
				//legalInstitution:1
			}
			//insert('cases',cas,(e)=>{
				//console.log("format data",cas);
				//console.log(e);
			//})
			insert('caseStatus',status_data,(e)=>{
				console.log(e);
			})	
		}
		
	});
	return data;
}
function convertOldData(odata,refer){
	var nData=[];
	if(odata.indexOf('；')>-1 || odata.indexOf('、')>-1|| odata.indexOf('(')>-1|| odata.indexOf('（')>-1){
		var tempData=[];
		if(odata.indexOf('；')>-1)
			tempData=odata.split('；');
		else if(odata.indexOf('、')>-1)
			tempData=odata.split('、');
		else
			tempData=[odata];
		
		$.each(tempData,(index,data)=>{
			if(data.length>0){
				var _data=data.split('(');
				if(party.indexOf('（')>-1){
					_data=data.split('（');
				}
				var _name="";
				var _status="无";
				var _status_id=0;
				if(_data.length>1){
					_name=_data[0];
					_status=_data[1].replace(')','').replace('）','');
					_status_id=refer.indexOf(_status);

				}else if(_data.length==1){
					_name=_data[0];
				}
				
				if(data.indexOf('（')>-1){
					//console.log('format data special',_status_id+_name,_data);
				}
				nData.push(_status_id+_name);
			}
			
		});
	}else{
		if(isNaN(parseInt(odata[0]))){
			nData.push(0+odata);
		}
	}
	return nData;
}