var firstPageTableColumns={
    id:{
       label: "序号",
       width:50,
    },
    caseNo:{
        label:"案件编号"
    },
    caseName:{label:"案件名称"},
    caseReason:{label:"案由",data:case_causes},
    caseType:{label:"案件类型",data:case_types},
    caseBelong:{label:"所属项目",data:projects},
    caseApplicant:{label:"申请人",},
    caseCreateDate:{label:"创建时间"},
    }
var baseData;
const resizeObserver = new ResizeObserver(entries => 
    console.log('Body height changed:', entries[0].target.clientHeight)
  )
  
  // start observing a DOM node
  resizeObserver.observe(document.body)
$(function(){
    showLoading("读取中....");
    if(sessionStorage.getItem("currentUser") && JSON.parse(sessionStorage.getItem("currentUser")).name){
        let user = document.getElementById("name");
        user.innerHTML=JSON.parse(sessionStorage.getItem("currentUser")).name;
        
    }else{
        //SendMessage("错误: "+error.FORM_INVALID_USER.message,"是否跳转到登录页面？",function(){
            //HideMessage();
            //window.location.href = 'index.html';
        //});
        //document.body.innerHTML="没有登录。。。"
        //window.location.href = 'index.html';
    }
    getUserList(function(r){
        console.log('getUserList........'+(r.length));
        //sessionStorage.setItem("userList",JSON.stringify(r));
        setGlobalJson("userList",r);
        console.log(getGlobalJson("userList"));
        console.log('getUserList........');
        getCasesData(function(r){
            console.log('getCasesData');
            console.log(r);
            setGlobalJson("mainData",r);
            baseData=r;
            _initRegTable(r,firstPageTableColumns);
            $("#frame").removeClass('hide');
            hideLoading();
            //$.mobile.hidePageLoadingMsg(); 
        });
    });
    //console.log($('#popup_form_main'));
    $('#add_case_popup').resize(function(){
        console.log("size changed...");
    })
});


var main_form;
//var form_item_ids=getFormItemsId(FormTemplate);
$('body').on('completed',function(data){
_createNewCaseForm(FormTemplate);
});

function _createNewCaseForm(template){
    main_form= new mform({template:template});
    var form=main_form.instance;
    
    const popup_form = document.getElementById("popup_form_main");
    //popup_form.innerHTML+=form.html();
    form.append($('<fieldset class="ui-grid-a">'+
    '<div class="ui-block-a"><button type="submit" id="caseReg_but" class="ui-btn ui-corner-all ui-shadow ui-icon-check case-reg-but">提交</button></div>'+
    '<div class="ui-block-b"><a id="caseReg_but_cancel" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-back case-reg-but">取消</a></div></fieldset>'));
    //form.css({padding:"10px 20px"});
    //$("#add_case_popup").children().remove();
    $(popup_form).html('<h3 id="reg_form_title">新增案件</h3>');
    $(popup_form).append(form);
    $(popup_form).append($('<div class="progress_lock edit-info hide">'+
                            '<div class="ui-input-btn ui-btn ui-icon-lock ui-btn-icon-notext ui-corner-all ui-shadow btn-icon-red ui-but-lock-edit">'+
                                '<input type="button" data-enhanced="true" value="锁">'+
                            '</div></div>'));
    $("#add_case_popup").css({"min-width":"1000px"});

    $("#popup_form_main").trigger('create');

    //#region 按钮点击事件

    //新增案件按钮
    $('#add_case_but').on('click',async function(e){
        //console.log("add......................");
        
        await _showEmptyForm();
        //console.log('currentId...................'+sessionStorage.getItem("currentId"));
    });
    //表格 提交 和 取消 按钮
    $('.case-reg-but').on('click',function(e){
        //console.log(e.currentTarget);
        if(e.currentTarget.id=="caseReg_but_cancel"){
            _setBlurBackgroundVisibility(false);
        }else if(e.currentTarget.id=="caseReg_but"){
            main_form.instance.getValues(sessionStorage.getItem("currentId"),FormTemplate.template,function(message,values){
                if(values.success){
                    console.log(message.message);
                    values.data["caseCreateDate"]=getDateTime();
                    //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
                    if(getGlobalJson("currentUser")==null || getGlobalJson("currentUser")==undefined){
                        SendMessage("错误: "+error.FORM_INVALID_USER.message,"是否跳转到登录页面？",function(){
                            //HideMessage();
                            window.location.href = 'index.html';
                        });
                    }else{
                        values.data["caseApplicant"]=getGlobalJson("currentUser").id;
                        values.data["isReadOnly"]=_isReadOnlyCurrentForm();
                        
                        showLoading("保存中...");
                        //console.log(values);
                        insertCase(values.data,function(r){
                            //console.log(r);
                            if(r.success){
                                console.log("修改添加成功。");
                                SendMessage("提示","保存完成。",function(){
                                    _setBlurBackgroundVisibility(false);
                                    location.reload();
                                },true);
                                
                            }else{
                                console.log(r);
                                SendMessage("错误",r.error,function(){},true);
                            }
                            hideLoading();
                        });
                    }
                    
                    
                }else{
                    console.log(message.message+(message.id==0?" 但是有错误。":""));
                }
            });
        }
        //
    });
    //表格 编辑锁按钮
    $('.ui-but-lock-edit').on('click',function(e){
        requestPassword("提示",'这里是需要管理员密码的。',function(e){
            //HideMessage();
            console.log(e==auth_code);
            if(e==auth_code){
                var id=sessionStorage.getItem("currentId");
                var datas=baseData.filter(d=>d.id==id);
                if(datas.length>0){
                    var data=datas[0];
                    data.isReadOnly=!Boolean(data.isReadOnly);
                    showLoading("保存中...");
                    _setFormReadOnly(data.isReadOnly);
                    data['caseCreateDate']=getDateTime();
                    data['caseDate']=getDateTime(data.caseDate);
                    insertCase(data,function(r){
                        //console.log(r);
                        if(r.success){
                            console.log("修改isReadOnly为"+data.isReadOnly);
                        }else{
                            console.log(r);
                            SendMessage("错误",r.error,function(){
                                //HideMessage();
                                
                            },true);
                        }
                        hideLoading();
                    });
                }
            }else{
                console.log("密码无效。");
                setTimeout(function() {
                    SendMessage("错误","密码无效。",function(){
                        //HideMessage();
                        
                    },true);
                  }, 100);
            }
            
        },true);
        
        
    });
      //#endregion
}
function _isReadOnlyCurrentForm(){
    var datas=baseData.filter(d=>d.id==getGlobal("currentId"));
    if(datas.length>0)
        return datas[0].isReadOnly;
    return true;
}
function _showEditForm(data){
    setGlobal("currentId", data.id);
    main_form.setData(data);
    $('.progress_lock.edit-info').removeClass('hide');
    _setFormReadOnly(data.isReadOnly);
    _setBlurBackgroundVisibility(true);
}
async function _showEmptyForm(){
    showLoading("读取中....");
    await getCaseLatestIndex().then(id=>{
        
        sessionStorage.setItem("currentId", id+1);
        //main_form.instance.setEmptyData(FormTemplate.template);
        main_form.readOnly(false).setEmptyData();
        $('.progress_lock.edit-info').addClass('hide');
        $("#reg_form_title").text("新增档案");
        hideLoading();
        _setBlurBackgroundVisibility(true);
    });
    
}
function _setFormReadOnly(isReadOnly){
    if(isReadOnly){
        $("#reg_form_title").text("查看档案");
        $('#caseReg_but').addClass("ui-state-disabled");
        $(".ui-but-lock-edit").removeClass('btn-icon-green').addClass('btn-icon-red');
    }else{
        $("#reg_form_title").text("修改档案");
        $('#caseReg_but').removeClass("ui-state-disabled");
        $(".ui-but-lock-edit").removeClass('btn-icon-red').addClass('btn-icon-green');
    }
    main_form.readOnly(isReadOnly);
}
function _setBlurBackgroundVisibility(isVisible){
    //$("#add_case_popup").css({width:"100%",height:"100%"});
    if(isVisible) {
        $("#add_case_popup").popIn($('.popup-background.popup-a'));
        setTimeout(function() {
            //$("#add_case_popup").addClass('popup-fullscreen');
          }, 1000);
    //$("#add_case_popup").css({width:"100%",height:"100%"});
    }
    else {
        $('#add_case_popup').popOut($('.popup-background.popup-a'));
    }
}
function SendMessage(title,message,res,isComfirm){
    $("#message_title").text(title);
    $(".message_content").children().remove();
    $(".message_content").append($('<div>'+message+'</div>'));

    $(".message_content").trigger('create');
    $("#message_popup").popIn($('.popup-background.popup-c'));
    var but_html=PopupBottomYesNo.format('pass_confirm_but','pass_cancel_but','确认','取消');
    if (isComfirm) but_html=PopupBottomYes.format('pass_confirm_but','确认');
    $('#message_popup').append($(but_html));
    $('.popup_message_but').on('click',function(e){
        if(e.currentTarget.id=="message_confirm_but"){
            res();
        }
        HideMessage();
    });
    //$('.popup_message_but').off('click',"**");
}
function requestPassword(title,message,res){
    $("#message_title").text(title);
    $(".message_content").children().remove();
    $(".message_content").append($('<div>'+message+'</div>'));
    
    $(".message_content").append($('<input type="password" id="auth_code" value="" placeholder="请输入密码">'));
    

    $(".message_content").trigger('create');
    //console.log();
    $('#message_popup').append($(PopupBottomYesNo.format('pass_confirm_but','pass_cancel_but','确认','取消')));
    $('.popup_message_but').on('click',function(e){
        if(e.currentTarget.id=="pass_confirm_but"){
            res($('#auth_code').val());
        }
        HideMessage();
    });
    $("#message_popup").popIn($('.popup-background.popup-c'));
    //$('.popup_message_but').off('click',"**");
}
function HideMessage(){
    $("#message_popup").popOut($('.popup-background.popup-c'));
    $(".message_content").children().remove();
    $('.popup_message_buts').remove();
    
}

