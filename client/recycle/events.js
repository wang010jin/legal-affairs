function addClickEvents(){
    var currentProgress={};
    //#region 右上角全局功能按钮
    var list=['corporateCompanies'];
    //list=undefined;
    $('.popup-add-table').on('click',function(e){
        //createBasicDatabase();
        //createTable('caseUpdates',caseUpdates);
        //createTable('caseExcutes',caseExcutes);
        //createTable('caseProperties',properties);
        //createTable('caseAttachments',attachments);
    });
    $('.popup-read-table').on('click', function(e){
        //getBasicDatabaseData(list).then(res=>console.log(res));

    });
    $('.popup-add-row').on('click', function(e){
        //insertBasicDatabaseData(list);
        //insertRows('caseUpdates',caseStatus_,(r)=>{})
        //insertRows('caseExcutes',caseExcutes_,(r)=>{})
        //insertRows('caseProperties',caseProperties_,(r)=>{})
        //insertRows('caseAttachments',caseAttachments_,(r)=>{})
    });
    $('#popupMenu').find('a').on('click',function(e){
        switch($(this).text()){
            case '设置':
                $.mobile.navigate( $(this).attr( "href" ));
                break;
        }
        
    })
    //#endregion

    //#region 第一页面 table 的 checkbox 和 按钮 事件
    setCheckAllBox($('.reg-checkbox-all'),'pageOneTable');
    //表格内每行的功能按钮事件
    var fn_buts = document.querySelectorAll("[name^=fn_btn]")
    fn_buts.forEach(function(fn_but) {
        //console.log($(fn_but));
        //if(fn_but.name=="fn_btn_details") $(fn_but).jqmData('transition','slidefade');
        fn_but.addEventListener('click', function(but) {
            var index=but.currentTarget.dataset.item;
            console.log(index+"--"+but.currentTarget.name);
            //console.log(table_data[fn_but.dataset.item]);
            var matchItems=DataList.combinedData.filter((item) =>item.id == index);
            //var matchedData=getGlobalJson("mainDataStatus").filter((d)=>d.id==index);
            var caseNos=[];
            matchItems.forEach(_item=>{
                caseNos.push(_item.caseNo);
            });
            //第一页表格 删除 按钮
            if(but.currentTarget.name=="fn_btn_delete"){
                $().requestDialog({
                    title:'提示',
                    message:"确认删除案件编号[ "+caseNos.join(',')+" ]吗？",
                },function(form){
                    console.log("删除");
                    if(matchItems.length>0){
                        //console.log('matchItems:',matchItems);
                        $('#pageOneTable').removeTableItem(DataList.combinedData,matchItems[0],(res)=>{
                            DataList.combinedData=res;
                            if(enableRealDelete) removeCase(matchItems[0].id,'cases',(r)=>{console.log});
                            //console.log(DataList.combinedData);
                        });
                        //
                    }
                    
                    //_initRegTable(r,firstPageTableColumns,"pageOneTable");
                    
                    //$("#pageOneTable").hpaging({ limit: 5 });
                    //$("#pageOneTable").trigger('create');
                });
                
            }
            //第一页表格 编辑 按钮
            else if(but.currentTarget.name=="fn_btn_edit"){
                if(matchItems.length>0){
                    var loader=$().mloader("show",{message:"读取中...."});
                    //_showEditForm(matchItems[0]);//naviation.js
                    var _this=this;
                    //$("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                    setGlobal("currentId", matchItems[0].id);
                    //_setBlurBackgroundVisibility(true);
                    $.mobile.navigate( $(_this).attr( "href" ));
                    setTimeout(function() {
                        //console.log(matchItems[0]);
                        //main_form.setData(matchItems[0]);
                        //main_form.readOnly(false);
                        //
                        //console.log("data-role------"+$('.edit-header-btn[name="save_btn"').jqmData('role'));
                        main_form.setData(matchItems[0]);
                        main_form.readOnly(matchItems[0].isReadOnly);
                        _setTitleBar("reg_form_title");
                        $().mloader("hide");
                    }, 500);
                    //$('.progress_lock.edit-info').removeClass('hide');
                    //_setFormReadOnly(data.isReadOnly);
                    //_setBlurBackgroundVisibility(true);
                    
                }
                //console.log($("#popup_form_main"));
            }
            //第一页表格 查看 按钮
            else if(but.currentTarget.name=="fn_btn_details"){
                var matchedUpdates=DataList.caseUpdates.filter((d)=>d.id==index);
                var matchedExcutes=DataList.caseExcutes.filter((d)=>d.id==index);
                var matchedProperties=DataList.caseProperties.filter((d)=>d.id==index);
                var matchedAttachments=DataList.caseAttachments.filter((d)=>d.id==index);
                showProgressDetails(matchItems,matchedUpdates,matchedExcutes,matchedProperties,matchedAttachments);
                
            }
        
        })
    });
    //第一页左下方 添加 删除 按钮事件
    $('.case_reg_but').on('click',async function(e){
        e.preventDefault();
        if(this.id=="case_reg_but_add"){
            $().mloader("show",{message:"读取中...."});
            await getCaseLatestIndex().then(id=>{
                
                sessionStorage.setItem("currentId", id+1);
                
                //main_form.readOnly(false);
                //main_form.instance.setEmptyData(FormTemplate.template);
                //main_form.readOnly(false).setEmptyData();
                //main_form.instance.setEmptyData()
                //
                
                //main_form.readOnly(false).setEmptyData();
                $('.progress_lock.edit-info').addClass('hide');
                //console.log($('.progress_lock.edit-info'));
                $("#reg_form_title").html("新增档案");
                $('.edit-header-btn[name="save_btn"').show();
                //_setBlurBackgroundVisibility(true);
                $.mobile.navigate( $(this).attr( "href" ));
               // main_form.readOnly(false).setEmptyData();
                    //$().mloader("hide");
                setTimeout(function() {
                    main_form.readOnly(false).setEmptyData();
                    
                    $().mloader("hide");
                }, 500);
                //main_form.setData(getGlobalJson("mainData")[0]);
                //$("#fullscreenPage").trigger('create');
                //main_form.instance.trigger('create');
            });
            
        }else if(this.id=="case_reg_but_remove"){
            var targetTable='#pageOneTable';
            if(getGlobal('currentPage')=="#page2"){
                targetTable='#pageSecondTable';
            }
            console.log("currentPage",$(getGlobal('currentPage')),targetTable,(getGlobal('currentPage')=="#page2"));
            //console.log($('#pageOneTable').find('input[type="checkbox"][name="item_checkbox"]:checked'));
            var checked=$(targetTable).find('input[type="checkbox"][name="item_checkbox"]:checked');
            if(checked.length>0){
                $().requestDialog({
                    title:'提示',
                    message:"确认删除所选案件吗？",
                },function(form){
                    console.log("删除");
                    var matcheds=[];
                    var ids=[];
                    $.each($(targetTable).find('input[type="checkbox"][name="item_checkbox"]:checked'),function(index,check){
                        console.log("delete...",$(check).data('item'));
                        var matched=DataList.combinedData.filter((d)=>{return d.id==$(check).data('item')});
                        if(matched.length>0){
                            matcheds.push(matched[0]);
                            ids.push(matched[0].id);
                        }
                        
                    });
                    if(matcheds.length>0){
                        DataList.combinedData=$(targetTable).removeTableItems(DataList.combinedData,matcheds,(data)=>{
                            $('.reg-checkbox-all').prop("checked",false);
                            //pageSeTable.pageTable('refresh');
                            DataList.combinedData=data;
                            if(enableRealDelete) removeCases(ids,'cases',(res)=>console.log);
                            setTimeout(() => {
                                fancyTable1.tableUpdate($("#pageOneTable"));
                                $("#pageOneTable").trigger('create');
                            }, 1000);
                            
                            //console.log('deleted1....', DataList.combinedData);
                            //pageOnTable.pageTable('create',DataList.combinedData);
                        });
                        
                        
                        
                        //console.log(matcheds);
                    }
                    //_initRegTable(r,firstPageTableColumns,"pageOneTable");
                    
                    //$("#pageOneTable").hpaging({ limit: 5 });
                    //$("#pageOneTable").trigger('create');
                });
            }
            
           
        }
    })
    //#endregion

    //#region 第二页面
    setCheckAllBox($('#mainFooter').find('input[type="checkbox"]'),'pageSecondTable');
    //流程图节点点击弹出菜单
    $('#progress_popupMenu').find('a').on('click',function(e){
        $('#progress_popupMenu').popup('close');
        switch($(this).text()){
            case '查看':
                //$( "#update_panel" ).panel( "open" );
                //$( "#progress_details_info" ).removeClass('hide');
                $().mloader('show',{message:"读取中..."});
                setTimeout(() => {
                    //console.log('查看...',sessionStorage.getItem("currentId"));
                    var index=Number(sessionStorage.getItem("currentId"));
                    _setTitleBar("progress_details_info_title",'caseNo');
                    var caseStatus=currentProgress['targetPosition'].main+1+currentProgress['targetPosition'].sub/10;
                    console.log('查看...',index,caseStatus,DataList.caseUpdates);
                    var matchedUpdates=$.grep(DataList.caseUpdates,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus));
                    var matchedExcutes=$.grep(DataList.caseExcutes,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus));
                    var matchedProperties=$.grep(DataList.caseProperties,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus));
                    var matchedAttachments=$.grep(DataList.caseAttachments,(d)=>Number(d.id)==index && compareStatus(d.caseStatus,caseStatus));
                    var greatMatched=matchedUpdates.concat(matchedExcutes,matchedProperties,matchedAttachments);
                    console.log('查看...',greatMatched);
                    $('#progress_details_info_body').empty();
                    greatMatched.forEach((ite)=>{
                        var _data=getEventsDetails(ite);
                        var date_bar=$('<li data-role="list-divider">'+_data.date+'</li>');
                        var item_container=$('<li></li>');
                        if(ite.hasOwnProperty('evidenceId')){
                            var list_item=$('<h3 style="padding-left:15px;margin:auto 0px;">'+_data.description+'</h3>');
                            
                            item_container=$('<li style="padding:0px;"></li>');
                            var group=$('<div style="display: grid;grid-template-columns: 1fr auto auto;grid-gap: 0px;margin:-8px 0px;"></div>');
                            var view_btn=$('<a href="#" class="ui-btn ui-icon-eye ui-btn-icon-notext btn-icon-green" style="padding:10px 5px;border-top: none;border-bottom: none;">查看</a>')
                            var del_btn=$('<a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext btn-icon-red" style="padding:10px 5px;border: none;">删除</a>')
                            group.append(list_item);
                            group.append(view_btn);
                            group.append(del_btn);
                            item_container.append(group);
                        }else{
                            var list_item=$('<a href="#">'+_data.description+'</a>');
                            
                            item_container.append(list_item);
                            var del_btn=$('<a href="#" class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-right ui-btn-icon-notext btn-icon-red">删除</a>');
                            item_container.append(del_btn);
                        }
                        
                        $('#progress_details_info_body').append(date_bar);
                        
                        $('#progress_details_info_body').append(item_container);
                    });
                    //$('#progress_details_info_body').trigger('create');
                    $('#progress_details_info_body').listview().listview('refresh');
                    $.mobile.navigate( "#progress_details_info");
                    $().mloader('hide');
                }, 200);
                //$.mobile.navigate( "#progress_details_info");
                break;
            case '进展':
                console.log("进展");
                setTimeout(() => {
                    var form= new mform({template:add_update_template});
                    $('#progress_popup_add_title').text(getStatusLabel(currentProgress['targetPosition'],progresses)+" 添加新的进展");
                    $('#progress_popup_add_form').empty();
                    $('#progress_popup_add_form').append(form.instance);
                    $('#progress_popup_add_form').trigger('create');
                    $('#progress_popup_add').popup('open');
                }, 200);
                break;
            case '执行':
                console.log("执行");
                setTimeout(() => {
                    var form= new mform({template:add_execute_template});
                    $('#progress_popup_add_title').text(getStatusLabel(currentProgress['targetPosition'],progresses)+" 添加新的执行");
                    $('#progress_popup_add_form').empty();
                    $('#progress_popup_add_form').append(form.instance);
                    $('#progress_popup_add_form').trigger('create');
                    $('#progress_popup_add').popup('open');
                }, 200);
                break;
            case '财产':
                console.log("财产");
                setTimeout(() => {
                    var form= new mform({template:add_property_template});
                    $('#progress_popup_add_title').text(getStatusLabel(currentProgress['targetPosition'],progresses)+" 添加新的财产变更");
                    $('#progress_popup_add_form').empty();
                    $('#progress_popup_add_form').append(form.instance);
                    $('#progress_popup_add_form').trigger('create');
                    $('#progress_popup_add').popup('open');
                }, 200);
                break;
            case '附件':
                console.log("附件");
                setTimeout(() => {
                    var form= new mform({template:add_evidence_template});
                    $('#progress_popup_add_title').text(getStatusLabel(currentProgress['targetPosition'],progresses)+" 添加新的附件证明");
                    $('#progress_popup_add_form').empty();
                    $('#progress_popup_add_form').append(form.instance);
                    $('#progress_popup_add_form').trigger('create');
                    $('#progress_popup_add').popup('open');
                }, 200);
                break;
        }
    })
    //第二页表格每行的功能按钮 编辑，查看，删除
    console.log($('#pageSecondTable').find('.table-fn-btn'));
    $('#pageSecondTable').find('.table-fn-btn').on('click',function(e){
        console.log($(this).jqmData('index')+"---"+$(this).text());
        var index=$(this).jqmData('index');
        var matchedData=DataList.combinedData.filter((d)=>d.id==index);
        var matchedMainData=DataList.combinedData.filter((d)=>d.id==index);
        var matchedUpdates=DataList.caseUpdates.filter((d)=>d.id==index);
        var matchedExcutes=DataList.caseExcutes.filter((d)=>d.id==index);
        var matchedProperties=DataList.caseProperties.filter((d)=>d.id==index);
        var matchedAttachments=DataList.caseAttachments.filter((d)=>d.id==index);
        var combineUpdates=matchedUpdates.concat(matchedExcutes,matchedProperties,matchedAttachments);
        console.log('combineUpdates',combineUpdates);
        switch($(this).text()){
            case '编辑':
                $().mloader("show",{message:"读取中...."});
                $("#progress_details").empty();
                $("#progress_diagram").empty();
                setGlobal("currentId",index);
                var progressInfoForm=_createNewCaseForm(progress_form_template,"progress_details");
                progressInfoForm.instance.find('#attorney').parent().css({"width": "250px"});
                $.mobile.navigate( '#progress');
                if(matchedMainData.length>0){
                    console.log(matchedMainData[0].caseNo);
                    _setTitleBar("progress_title",'caseNo');
                    var status_val=-1;
                    if(matchedData.length>0){
                        progressInfoForm.setData(matchedData[0]).readOnly(matchedMainData[0].isReadOnly);
                        //$("#progress_diagram").empty();
                        status_val=Number(matchedData[0].caseStatus);
                        
                    }else{
                        progressInfoForm.setEmptyData();
                    }
                    var but=new ProgressesButton({
                        steps:progresses,
                        deadSteps:deads,
                        showLabel:true,
                        containerId:'#progress_diagram',
                        currentPosition:status_val,
                        fontSize:15,
                        line_size:4,
                        size:30,
                        width:840,
                        hasShadow:true,
                        isViewMode:true,
                        //verticalGap:2,
                        //labelPosition:"bottom",
                        showSubSteps:true,
                        readOnly:matchedMainData[0].isReadOnly,
                        showCounter:true,
                        counterData:matchedUpdates.concat(matchedExcutes,matchedProperties,matchedAttachments),
                    });
                    currentProgress['currentDiagramButton']=but;
                    $(but.instance).on("itemOnClicked",  function (e){
                        console.log('targetPosition...e',e);
                        currentProgress['targetPosition']=e.Position;
                        currentProgress['originalPosition']=formatIndex(but.opt.currentPosition);
                        currentProgress['isReadOnly']=matchedMainData[0].isReadOnly;
                        
                    //console.log('targetPosition...',currentProgress['targetPosition']);

                        //$( "#update_panel" ).panel( "open" );
                        var title=progresses[e.Position.main] instanceof Array?progresses[e.Position.main][e.Position.sub]:progresses[e.Position.main];
                        
                        $("#progress_popupMenu_title").text('请选择对 '+title+' 的操作');
                        if(matchedMainData[0].isReadOnly) $('.progress_popupMenu_add_group').hide();
                        else {
                            $('.progress_popupMenu_add_group').show();
                            
                        }
                        var exeBtn=$.grep($($('#progress_popupMenu_add_group').find('a')),(a)=>{
                            //console.log('setMainForm', $(a).text()=="执行");
                            return $(a).text()=="执行";
                        });
                        //console.log('setMainForm',e.Position.main);
                        if((e.Position.main==3||e.Position.main==2)&&!matchedMainData[0].isReadOnly){
                            $(exeBtn).show();
                            $(exeBtn).css({'display':'block'});
                        }else{
                            $(exeBtn).hide();
                        }
                        //$('#progress_popupMenu_add').find('ul').trigger('create').listview().listview('refresh');
                       // $('#progress_popupMenu_add').find('div').trigger('create');
                        //$('#progress_popupMenu_add').find('div').
                        //console.log('progress_popupMenu_add',$('#progress_popupMenu_add').find('ul'));
                        //console.log('progress_popupMenu_add',$("#progress_popupMenu").find('ul'));
                        $("#progress_popupMenu").trigger('create');
                        
                        $("#progress_popupMenu").popup('open');
                        $("#progress_popupMenu").popup('reposition',{x:e.event.pageX,y:e.event.pageY});
                        $("#progress_popupMenu_add_group").listview().listview('refresh');
                        //console.log($("#progress_popupMenu"));
                    });
                    $("#progress_diagram").trigger('create');
                    $("#progress_details").trigger('create');
                }
                //setTimeout(function() {
                    $().mloader("hide");
                //},5000);
                $("#progress_details").trigger('create');
                

                
                break;
            case '查看':
                console.log('查看');
                showProgressDetails(matchedMainData,matchedUpdates,matchedExcutes,matchedProperties,matchedAttachments);
                break;
        }
    });
    //#endregion
  

    //#region 查看信息页面的按钮事件
    function showProgressDetails(datas,updates,excutes,properties,attachments){
        $().mloader('show',{message:"读取中..."});
        if(datas.length>0){
            //window.location="./test/timeline.html"
            $("#summary_list").children().remove();
            var data={
                template:["立案","一审","二审","执行","结案","再审","监督"],
                basic:datas[0],
                updates:updates,
                excutes:excutes,
                properties:properties,
                attachments:attachments,
                
            }
            
        //console.log('showProgressDetails',data);
            //if(datas[0].id>30){
                //dataList=[];
            //}

            $('#timelineTitle').text(datas[0].caseNo);
            var canvas=document.getElementById('myCanvas');
            //eventManager.setCanvas(canvas);

            new timelinePage({template:_summary_template,data:data,summaryListContainer:"#summary_list",canvas:canvas});
            $("#summary_list").trigger('create');
            $.mobile.navigate( "#timeline");
            //$("#page4").removeClass('hide');
            //$(getGlobal('currentPage')).addClass('hide');
            //_setFlowChart(table_progress_data,table_progress_status,table_progress_executes,table_progress_updates,matchItems[0].id);
        }
        $().mloader('hide');
    }
    //只读锁按钮事件
    function lockEvent(e){
        var _this=this;
        $().requestPassword(function(res){
            if(res.success){
                console.log("登陆成功。。")
                var id=getGlobal("currentId");
                var datas=DataList.combinedData.filter(d=>d.id==id);
                if(datas.length>0){
                    //console.log(Boolean(datas[0].isReadOnly));
                    datas[0].isReadOnly=!Boolean(datas[0].isReadOnly);
                    //console.log(datas[0].isReadOnly);
                    if(datas[0].isReadOnly) {
                        if(_this.id=="reg_form_title"){
                            $("#reg_form_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+"查看档案");
                        }else if(_this.id=="progress_title"){
                            $("#progress_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+$("#progress_title").text());
                            
                        }else if(_this.id=="progress_details_info_title"){
                            $("#progress_details_info_title").html('<i class="fa fa-lock text-red edit-lock"></i>'+$("#progress_details_info_title").text());
                            
                        }
                        $('.edit-header-btn[name="save_btn"').hide();
                    }
                    else {
                        if(_this.id=="reg_form_title"){
                            $("#reg_form_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+"修改档案");
                        }else if(_this.id=="progress_title"){
                            $("#progress_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+$("#progress_title").text());
                            
                        }else if(_this.id=="progress_details_info_title"){
                            $("#progress_details_info_title").html('<i class="fa fa-unlock text-green edit-lock"></i>'+$("#progress_details_info_title").text());
                            
                        }
                        $('.edit-header-btn[name="save_btn"').show();
                    }
                    
                    //_setFormReadOnly(data.isReadOnly);
                    //console.log(getGlobalJson('mainData'));
                    if(_this.id=="reg_form_title"){
                        main_form.readOnly(datas[0].isReadOnly);
                    }else if(_this.id=="progress_details_info_title"){
                        
                    }else if(_this.id=="progress_title"){
                        progressInfoForm.readOnly(datas[0].isReadOnly);
                        currentProgress['currentDiagramButton'].switchReadyOnly();
                    }
                    /*
                    $().mloader("show",{message:"保存中..."});
                    datas[0]['caseCreateDate']=getDateTime();
                    datas[0]['caseDate']=getDateTime(datas[0].caseDate);
                    insertCase(datas[0],function(r){
                        //console.log(r);
                        if(r.success){
                            console.log("修改isReadOnly为"+datas[0].isReadOnly);
                        }else{
                            console.log(r);
                            //SendMessage("错误",r.error,function(){
                                //HideMessage();
                                
                            //},true);
                        }
                        $().mloader("hide");
                    });
                    */
                }
            }else{
                $().minfo("show",{message:'密码无效。',type:'alert',title:'错误'});
            }
            
        });
    }
    //$("#reg_form_title").on('click',lockEvent);
    //$("#progress_title").on('click',lockEvent);
    //$("#progress_details_info_title").on('click',lockEvent);
    //#region 编辑和添加页面右上的保存按钮
    //保存按钮事件
    $('.edit-header-btn').on('click',function(e){
        if($(this).text()=="保存"){
            //console.log("保存");
            console.log($(pageOnTable).html())
            main_form.instance.getValues(getGlobal("currentId"),FormTemplate3.template,function(message,values){
                if(values.success){
                    console.log(message.message);
                    console.log(values.data);
                    values.data.values["caseCreateDate"]=getDateTime();
                    //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
                    if(getGlobalJson("currentUser")==null || getGlobalJson("currentUser")==undefined){
                        $().minfo('show',{title:"错误: "+error.FORM_INVALID_USER.message,message:"是否跳转到登录页面？"},function(){
                            //HideMessage();
                            window.location.href = 'index.html';
                        });
                    }else{
                        values.data.values["caseApplicant"]=getGlobalJson("currentUser").id;
                        values.data.values["isReadOnly"]=_isReadOnlyCurrentForm();
                        values.data.values["id"]=Number(values.data.values["id"]);
                        $().mloader('show',{message:"保存中..."});
                        //console.log(values.data);
                        insertCase(values.data.values,function(r){
                            //console.log(r);
                            if(r.success){
                                console.log("修改添加成功。");
                                $().minfo('show',{title:"提示",message:"保存完成。"},function(){
                                    $.mobile.navigate('#');
                                });
                                saveNewData2List(DataList.combinedData,values.data.values,'id');//tools.js
                            }else{
                                console.log(r);
                                $().minfo('show',{title:"错误",message:r.error});
                            }
                            $().mloader('hide');
                        });
                    }
                    
                    
                }else{
                    console.log(message.message+(message.id==0?" 但是有错误。":""));
                }
            });
        
        }
    })
    //#endregion
    var lockeventListener=[];
    function _setTitleBar(titlebarId,displayKey){
        var lockedTitle="查看案件";
        var unlockedTitle="修改案件";
        titlebarId=titlebarId.replace("#","");
        var matched=DataList.combinedData.filter((d)=>{return d.id==sessionStorage.getItem("currentId")});
        if(matched.length>0){
            if(displayKey!=undefined){
                lockedTitle=matched[0][displayKey];
                unlockedTitle=matched[0][displayKey];
            }
            if(matched[0].isReadOnly) {
                $("#"+titlebarId).html('<i class="fa fa-lock text-red edit-lock"></i>'+lockedTitle);
                $('.edit-header-btn[name="save_btn"').hide();
            }
            else {
                $("#"+titlebarId).html('<i class="fa fa-unlock text-green edit-lock"></i>'+unlockedTitle);
                $('.edit-header-btn[name="save_btn"').show();
            }
        }
        if(!lockeventListener.includes(titlebarId)){
            console.log(titlebarId+"没有注册锁按钮事件。。");
            $("#"+titlebarId).on('click',lockEvent);
            lockeventListener.push(titlebarId);
        }
            

    }
    function _isReadOnlyCurrentForm(){
        var datas=DataList.combinedData.filter(d=>d.id==getGlobal("currentId"));
        if(datas.length>0)
            return datas[0].isReadOnly;
        return true;
    }
    function setCheckAllBox(checkboxAll,targetTable){
        var _this=checkboxAll;
        var tr=$('#'+targetTable+' > tbody > tr');
        $.each($('#'+targetTable).find("input[type=checkbox][name=item_checkbox]"),function(index,checkbox) {
            //console.log()
            $(checkbox).on('change', function() {
                
                $(_this).prop("checked",
                tr.not(':hidden').length==tr.not(':hidden').find('input[type="checkbox"]:checked').length);
            
            })
        });
        $(_this).on('change',function() {
            //console.log('change');
            tr.not(':hidden').find('input[type="checkbox"]').prop( "checked", $(this).prop('checked') );
    
        });
    }
    
}
