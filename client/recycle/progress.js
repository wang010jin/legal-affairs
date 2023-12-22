$(document).on('focus', 'input[readonly]', function(e) {
  e.stopImmediatePropagation();
});
const clickedTarget = {
  same: 'same',
  sameParent: 'sameParent',
  notSame: 'notSame',
};
var progressButtons={};
var progressUpdateStatus={
  currentParentProgressButton:undefined,
  currentProgressButton:undefined,
  currentProgressTarget:undefined,
  clickedPosition:{main:-1,sub:0},
  isUpdateOnly:false,
  currentPopupId:-1,
  clickedTarget:clickedTarget.notSame,
}
const table_progress = document.getElementById("table2");
table_progress.innerHTML= _createProgressTableHTML(table_progress_data,table_progress_status,table_progress_updates);

  

var popup_details_form;
$('.popup_status_but').on("click",function(e){
  console.log(progressUpdateStatus.currentPopupId);
  if(e.currentTarget.id=='process_save_but'){
    table_progress_status.forEach((item)=>{
      //console.log(item.id);

      //console.log(progressUpdateStatus.currentPopupId);
        //console.log( "item.id==progressUpdateStatus.currentPopupId: "+item.id+"--"+progressUpdateStatus.currentPopupId+"=="+(Number(item.id)==Number(progressUpdateStatus.currentPopupId)));
      if (Number(item.id)==Number(progressUpdateStatus.currentPopupId)){
        item.caseStatus=(progressUpdateStatus.clickedPosition.main+progressUpdateStatus.clickedPosition.sub/10);
        progressButtons[item.id].refresh({currentPosition:item.caseStatus});
        item.penaltyAmount=400.00;
        //_createProgressTableHTML(data,data1,data2)
      }
      
    });
    console.log($(table_progress));
    //table_progress.innerHTML= _createProgressTableHTML(table_progress_data,table_progress_status,table_progress_updates);
    $(table_progress).trigger("create");
  }
  setProgressPopupVisisbility(false);
  
});
$('.popup_update_but').on("click",async function(e){
  //console.log(currentProgressButton);
  
  
  if(e.currentTarget.id=='process_update_save_but'){
    console.log("isUpdateOnly--"+progressUpdateStatus.currentProgressButton.opt.readOnly);
    //if(progressUpdateStatus.currentProgressButton.opt.readOnly) return;
    if (!progressUpdateStatus.currentProgressButton.opt.readOnly && progressUpdateStatus.clickedTarget!=clickedTarget.same) {
      
      if($(progressUpdateStatus.currentProgressTarget).data('isSelected')||progressUpdateStatus.clickedTarget==clickedTarget.sameParent){
        //console.log("确定删除之后的吗？");
        //$('.popup-b').addClass('popup-hide');
        if (!confirm(formatString(Message.PROGRESS_DELETE_WARNING_F,$("#process_updates_title").text()))) {
          return;
        } 
        
      }
      //console.log("last value: "+(progressUpdateStatus.clickedPosition.main+progressUpdateStatus.clickedPosition.sub/10));
      await progressUpdateStatus.currentProgressButton.setStep(progressUpdateStatus.currentProgressTarget);
      
    }
  }
  //history.back();
  
  setUpdatePopupVisisbility(false);
});

document.querySelectorAll("a[name^='popup_progress_']").forEach((pbut)=>{
  

 //设定每个查看按钮对应的流程图预览
  $(pbut).on("click",  function (e){
    //console.log("data-index: "+$(pbut).data("index"));
    sessionStorage.setItem("currentId", $(pbut).data("index"));
    _setFlowChart(table_progress_data,table_progress_status,table_progress_executes,table_progress_updates,$(pbut).data("index"));
  });
});
$('.ui-but-lock').on('click',function(e){
  console.log("ui-but-lock clicked....");
  var data=table_progress_data.filter(item=>item.id==sessionStorage.getItem("currentId"));
  console.log("ui-but-lock clicked...."+sessionStorage.getItem("currentId"));
  if(data.length>0){
    //console.log(data[0].isReadOnly);
    data[0].isReadOnly=!data[0].isReadOnly;
    //console.log(data[0].isReadOnly);
    
    popup_details_form.readOnly(data[0].isReadOnly);
    setElementDisableByReadonly(data[0].isReadOnly);
    progressUpdateStatus.currentParentProgressButton.switchReadyOnly();
    if(data[0].isReadOnly) $("#popup_progress_main").css({"min-width":"900px"})
    else $("#popup_progress_main").css({"min-width":"1200px"});
  }
});
document.querySelectorAll("td[name='progress_but']").forEach((pbut)=>{


    var but=new ProgressesButton({
        steps:progresses,
        deadSteps:deads,
        showLabel:true,
        containerId:'#'+pbut.id,
        currentPosition:Number(pbut.dataset.value),
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
      
      progressButtons[$(pbut).data("index")]=but;
      $(but.instance).bind('stepChanged',function (e){
        console.log(e.Position.main+"."+e.Position.sub);

      });
      $(but.instance).on("itemOnClicked",  function (e){
        //console.log(progresses[e.Position.main]+"."+e.Position.sub);
        if(progresses[e.Position.main] instanceof Array){
          console.log(progresses[e.Position.main][e.Position.sub]);
        }else{
          console.log(progresses[e.Position.main]);
        }
        if(progresses[e.Position.main]=="执行")  {
            console.log(but.opt.showSubSteps);
            if(!but.opt.showSubSteps) {
                but.opt.labelPosition="center";
                $(pbut).attr("height","80px")
            }
            else {
                but.opt.labelPosition="bottom";
                $(pbut).attr("height",Number.NaN)
            }
            but.switchSubStepVisibility({});
            //$('#popup_progress_'+$(pbut).data("index")).popup("open",{transition:"slidedown"});
        }
      });
});
function _setFlowChart(data,status,executes,updates,targetId){
  var data1=data.filter(value=>{ return value.id==targetId});
  var data2=status.filter(value=>{ return value.id==targetId});
  var data3=executes.filter(value=>{ return value.id==targetId});
  var data4=updates.filter(value=>{ return value.id==targetId});
  if(data1.length>0 && data2.length>0){
    console.log(data1[0].id+"----isReadOnly------"+data1[0].isReadOnly+"--"+((data1[0].isReadOnly==0 )));
    if (data1[0].isReadOnly || data1[0].isReadOnly==1) data1[0].isReadOnly=true;
    //else data1[0].isReadOnly=false;
    console.log(data1[0].id+"----isReadOnly------"+data1[0].isReadOnly);
    sessionStorage.setItem("currentId",data1[0].id);
    progressDetailsPopup(data2[0],data1[0].isReadOnly,$("#progress_status_details"));
    
    //$("#progress_status_details").trigger("create");
    $("#progress_status_container").empty();
    $('#popup_progress_title').text(data1[0].caseName+"-"+data2[0].caseNo);
    var but=new ProgressesButton({
      steps:progresses,
      deadSteps:deads,
      showLabel:true,
      containerId:'#progress_status_container',
      currentPosition:Number(data2[0].caseStatus),
      fontSize:15,
      line_size:4,
      size:30,
      width:840,
      hasShadow:true,
      isViewMode:true,
      //verticalGap:2,
      //labelPosition:"bottom",
      showSubSteps:true,
      readOnly:data1[0].isReadOnly,
      showCounter:true,
      counterData:data3.concat(data4),
    });
    
  progressUpdateStatus.currentParentProgressButton=but;
    //设置流程图里每个点的按钮连接任务
    $(but.instance).on("itemOnClicked",  function (e){
      progressUpdateStatus.currentProgressButton=but;
      progressUpdateStatus.clickedPosition=e.Position;
      progressUpdateStatus.currentProgressTarget=but.getItem(e.Position);
      progressUpdateStatus.originalPosition=formatIndex(but.opt.currentPosition);
      if(comparePoistion(e.Position,progressUpdateStatus.originalPosition)){
        progressUpdateStatus.clickedTarget=clickedTarget.same;
      }else{
        if(e.Position.main==progressUpdateStatus.originalPosition.main){
          progressUpdateStatus.clickedTarget=clickedTarget.sameParent;
        }else{
          progressUpdateStatus.clickedTarget=clickedTarget.notSame;
        }
      }
      
      
      console.log("isReadOnly===================="+data1[0].isReadOnly);
      
      //console.log(but.getItem(e.Position)==but.getItem(formatIndex(but.opt.currentPosition)));

      var title=progresses[e.Position.main] instanceof Array?progresses[e.Position.main][e.Position.sub]:progresses[e.Position.main];
      $("#process_updates_title").text(title);
      if(e.Position.main<2){
        $("#courtDate").val(getDateTime(data2[0].FristCounterData));
        $("#process_updates_courtDate").removeClass('hide');
      }else{
        $("#process_updates_courtDate").addClass('hide');
      }
      

      //$("#progress_step_update_list").html('');
      
      $("#process_update_list").html(addItemsToUpdatePopup(table_progress_updates.filter(value=>{ return value.id==data2[0].id && value.caseNo==data2[0].caseNo}),data1[0].isReadOnly) );
      $("#process_update_list").trigger("create");
      $("#process_property_list").html(addItemsToPropertyPopup(table_progress_property.filter(value=>{ return value.id==data2[0].id && value.caseNo==data2[0].caseNo}),data1[0].isReadOnly) );
      $("#process_property_list").trigger("create");
      $("#process_update_upload_list").html(addItemsToUploadPopup(table_progress_updates_attachments.filter(value=>{ return value.id==data2[0].id && value.caseNo==data2[0].caseNo}),data1[0].isReadOnly) );
      
      if(e.Position.main==3){
        $("#process_execute_collapset").removeClass('popup-hide');
        $("#process_execute_list").html(addItemsToExecutePopup(table_progress_executes.filter(value=>{ return value.id==data2[0].id && value.caseNo==data2[0].caseNo}),data1[0].isReadOnly) );
        
        //$("#process_update_collapset").data('collapsed',true);
        $("#process_execute_collapset").collapsible( "option", "collapsed", false );
        $("#process_execute_list").trigger("create");
      }else{
        $("#process_execute_collapset").addClass('popup-hide');
        
        $("#process_update_collapset").collapsible( "option", "collapsed", false );
      }
      
      //$("#process_update_list").listview("refresh");
      
      $("#process_update_upload_list").trigger("create");
      
      setUpdatePopupVisisbility(true);
      console.log($("#popupBasic").html());
      //$('.popup-main').addClass('blur-background');
      
    });
    setElementDisableByReadonly(data1[0].isReadOnly);
    //$('#progress_status_details').html(progressDetailsPopup(data1[0],data2[0]));
    
  }
  progressUpdateStatus.clickedPosition=formatIndex(Number(data2[0].caseStatus));
    progressUpdateStatus.currentPopupId=targetId;
    //$('.popup-background.popup-a').removeClass("popup-hide");
    setProgressPopupVisisbility(true);
}
function _createProgressTableHTML(data,data1,data2){
    var item_html="";
    var progresses=["一审","二审","执行",["强制执行","正常执行","未执行"],"结案","再审","监督"]; 
    data.forEach((item)=>{

        var relatedStatusData=data1.filter(value=>{ return value.id==item.id && value.caseNo==item.caseNo});
        var relatedUpdateData=data2.filter(value=>{ return value.id==item.id && value.caseNo==item.caseNo});
        if (relatedStatusData.length==0 && relatedUpdateData==0) return false;
        //console.log(relatedStatusData);
        //console.log("relatedStatusData....");
        var item_col_html="";
        var style=" style='max-width:100px;{0}'";
        var background="";
        var color="";
        console.log(case_labels_colors);
        if(case_labels_colors[case_labels[item.caseLabel]].background){
            
            background="background:"+case_labels_colors[case_labels[item.caseLabel]].background+";";
        }
        if(case_labels_colors[case_labels[item.caseLabel]].color){
            color="color:"+case_labels_colors[case_labels[item.caseLabel]].color+";";
        }
        if(background.length>0 || color.length>0){
            
            style=formatString(style,(background.length>0?background:"")+(color.length>0?color:""));
            //console.log("color---"+item.caseNo+": "+style);
        }
        else{
            //style="";

        }
        var status=formatSatusIndex(relatedStatusData[0].caseStatus);
        var case_state=progresses[status.main] instanceof Array?progresses[status.main][status.sub]:progresses[status.main];
        //console.log(item.caseNo+": "+style);
        item_col_html+='<td class="text-center" '+style+'><div>'+case_labels[item.caseLabel]+'</div></td>';
        item_col_html+='<td><div><div style="font-size:18px;font-weight:700;">案件编号：'+item.caseNo+'</div><div>案件名称：'+item.caseName+'</div><div></td>';
        item_col_html+='<td><div><div>案发原因：'+case_reason[item.caseReason]+'</div><div>提交日期：'+item.createDate+'</div><div></td>';
        item_col_html+='<td><div><div>案由：'+case_causes[item.caseCause]+'</div><div id="status_text_'+item.id+'">状态：'+case_state+'</div><div></td>';
        item_col_html+='<td><div>判决金额：'+relatedStatusData[0].penaltyAmount+'万</div><div>执行金额：'+relatedStatusData[0].exexuteAmount+'万</div></td>';
        item_col_html+='<td id="progress_funcion_but_'+item.id+'" class="progress_function_but" name="progress_function_but" data-index='+item.id+' data-value='+relatedStatusData[0].caseStatus+'>'+
        '<div class="custom-border-radius">'+
        '<a href="#" data-index="'+item.id+'" name="popup_progress_'+item.id+'" data-transition="fade" class="ui-btn btn-icon-green ui-icon-eye ui-btn-icon-notext ui-corner-all">查看</a></div>'+
        '</td>';
        item_col_html+='<td id="progress_but_'+item.id+'" class="progress_but_container" name="progress_but" data-index='+item.id+' data-value='+relatedStatusData[0].caseStatus+'></td>';
        item_html+='<tr class="table-row">'+item_col_html+'</tr>';
    });
    return '<tbody>'+item_html+'</tbody>';
    
}
var progressTableTemplate=[
  {
    width:Number.NaN,
    data:{
      caseLabel:{

      }
    }
  },
  {
    width:Number.NaN,
    data:{
      caseReason:{
        label:"案发原因：",
        data:case_reason
      },
      createDate:{
        label:"提交日期：",
      }
    }
  },
  {
    width:Number.NaN,
    data:{
      caseCause:{
        label:"案由：",
        data:case_causes
      },
      caseStatus:{
        label:"状态：",
        data:progresses
      }
    }
  },
  {
    width:Number.NaN,
    data:{
      penaltyAmount:{
        label:"判决金额(万)：",
      },
      exexuteAmount:{
        label:"执行金额(万)：",
      }
    }
  }
]



function addItemsToUpdatePopup(data,isReadOnly){
var table=$('<table></table>')
  var body=$('<tbody></tbody>');



  //table.append(header);
  //table.append(body);
  
  //console.log('clickedPosition');
 
  var filtedData=data.filter(function(item){ return comparePoistion(formatIndex(item.caseStatusId),progressUpdateStatus.clickedPosition)});
  var keys=[];
  var emptyItem={};
  var th=$('<tr></tr>');
  var thead=$('<thead></thead>');
  thead.append(th);
  $.each(list,function(key,value){
    var w=setColumnWidth(value.width);
    var h=$('<th'+w+'>'+value.label+'</th>');
    th.append(h);
    keys.push(key);
    emptyItem[key]="";
  });
  var h=$('<th></th>');
  th.append(h);
  if(filtedData.length>0){
    filtedData.forEach(function(item){
      var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(item[key]!= undefined){
          emptyItem['subId']=item.subId+1;
        //console.log(key+": "+item[key]);
          tr.append(SetData(list,key,item,isReadOnly));
          
        }
      })
      if(!isReadOnly){
        tr.append(SetData({empty:{type:"button"}},"empty",{subid:item.subId,icon:"btn-icon-red ui-icon-minus",label:"删除"},isReadOnly));
      }
        body.append(tr);
      
    });
    
  }
  if(!isReadOnly){
    var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(emptyItem[key]!= undefined){
        //console.log(key+": "+item[key]);
          tr.append(SetData(list,key,emptyItem),isReadOnly);
          
        }
      });
      
        tr.append(SetData({empty:{type:"button"}},"empty",{subid:emptyItem.subId,icon:"btn-icon-green ui-icon-plus",label:"添加"},isReadOnly));
        body.append(tr);
    }
  //console.log(table.html());
  table.append(thead);
  table.append(body);
  return table.html();
}
function addItemsToExecutePopup(data,isReadOnly){
  var table=$('<table></table>')
  var body=$('<tbody></tbody>');
 
  var filtedData=data.filter(function(item){ return comparePoistion(formatIndex(item.caseStatusId),progressUpdateStatus.clickedPosition)});
 
  //console.log('filtedData');
  //console.log(filtedData);
  var keys=[];
  var emptyItem={};
  var th=$('<tr></tr>');
  var thead=$('<thead></thead>');
  thead.append(th);
  $.each(list_executed,function(key,value){
    var w=setColumnWidth(value.width);
    console.log(w);
    var h=$('<th'+w+'>'+value.label+'</th>');
    th.append(h);
    keys.push(key);
    emptyItem[key]=key=="exexuteAmount"?0:"";
  });
  var h=$('<th></th>');
  th.append(h);
  if(filtedData.length>0){
    filtedData.forEach(function(item){
      var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(item[key]!= undefined){
          emptyItem['subId']=item.subId+1;
        //console.log(key+": "+item[key]);
          tr.append(SetData(list_executed,key,item,isReadOnly));
          
        }
      })
      if(!isReadOnly){
        tr.append(SetData({empty:{type:"button"}},"empty",{subid:item.subId,icon:"btn-icon-red ui-icon-minus",label:"删除"},isReadOnly));
      }
        body.append(tr);
      
      
    });
    
  }
  
  if(!isReadOnly){
  var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(emptyItem[key]!= undefined){
          //if(key=="fileName"){
          //  tr.append(SetData("file",key,emptyItem));
          //}else{
            tr.append(SetData(list_executed,key,emptyItem,isReadOnly));
          //}
        //console.log(key+": "+item[key]);
          
          
        }
      });
        tr.append(SetData({empty:{type:"button"}},"empty",{subid:emptyItem.subId,icon:"btn-icon-green ui-icon-plus",label:"添加"},isReadOnly));
        body.append(tr);
      }
  //console.log(table.html());
  table.append(thead);
  table.append(body);
  return table.html();
}
function addItemsToPropertyPopup(data,isReadOnly){
  console.log(isReadOnly);
  var table=$('<table></table>')
  var body=$('<tbody></tbody>');
 
  var filtedData=data.filter(function(item){ return comparePoistion(formatIndex(item.caseStatusId),progressUpdateStatus.clickedPosition)});
 
  var keys=[];
  var emptyItem={};
  var th=$('<tr></tr>');
  var thead=$('<thead></thead>');
  thead.append(th);
  $.each(list_proerty,function(key,value){
    var w=setColumnWidth(value.width);
    //console.log(w);
    var h=$('<th'+w+'>'+value.label+'</th>');
    th.append(h);
    keys.push(key);
    emptyItem[key]=key=="propertyStatus"?0:"";
  });
  var h=$('<th></th>');
  th.append(h);
  if(filtedData.length>0){
    filtedData.forEach(function(item){
      console.log(item);
      var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(item[key]!= undefined){
          emptyItem['subId']=item.subId+1;
        //console.log(key+": "+item[key]);
          tr.append(SetData(list_proerty,key,item,isReadOnly));
          
        }
      })
      if(!isReadOnly){
        tr.append(SetData({empty:{type:"button"}},"empty",{subid:item.subId,icon:"btn-icon-red ui-icon-minus",label:"删除"},isReadOnly));
      }
        body.append(tr);

      
    });
    
  }
  if(!isReadOnly){
      var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(emptyItem[key]!= undefined){
          //if(key=="fileName"){
          //  tr.append(SetData("file",key,emptyItem));
          //}else{
            tr.append(SetData(list_proerty,key,emptyItem,isReadOnly));
          //}
        //console.log(key+": "+item[key]);
          
          
        }
      });
        tr.append(SetData({empty:{type:"button"}},"empty",{subid:emptyItem.subId,icon:"btn-icon-green ui-icon-plus",label:"添加"},isReadOnly));
        body.append(tr);
      }
  //console.log(table.html());
  table.append(thead);
  table.append(body);
  return table.html();
}
function addItemsToUploadPopup(data,isReadOnly){
  //console.log(isReadOnly);
  var table=$('<table></table>')
  var body=$('<tbody></tbody>');
 
  var filtedData=data.filter(function(item){ return comparePoistion(formatIndex(item.caseStatusId),progressUpdateStatus.clickedPosition)});
 
  var keys=[];
  var emptyItem={};
  var th=$('<tr style="width:100%;"></tr>');
  var thead=$('<thead></thead>');
  thead.append(th);
  $.each(list_evidence,function(key,value){
    var w=setColumnWidth(value.width);
    //console.log(w);
    var h=$('<th'+w+'>'+value.label+'</th>');
    th.append(h);
    keys.push(key);
    emptyItem[key]=key=="fileName"?"":0;
  });
  var h=$('<th style="width:auto;"></th>');
  th.append(h);
  if(filtedData.length>0){
    filtedData.forEach(function(item){
      var tr=$('<tr style="width:100%;"></tr>');
      keys.forEach(function(key){
        if(item[key]!= undefined){
          emptyItem['subId']=item.subId+1;
        //console.log(key+": "+item[key]);
          tr.append(SetData(list_evidence,key,item,isReadOnly));
          
        }
      })
      if(!isReadOnly){
        tr.append(SetData({empty:{type:"buttons"}},"empty",[
          {subid:item.subId,icon:"btn-icon-red ui-icon-minus",width:"50%",label:"删除"},
          {subid:item.subId,icon:"btn-icon-green ui-icon-eye",width:"50%",label:"查看"}
        ],isReadOnly));
      }else{
        tr.append(SetData({empty:{type:"buttons"}},"empty",[
          {subid:item.subId,icon:"btn-icon-green ui-icon-eye",width:"50%",label:"查看"}
        ],isReadOnly));
      }
        body.append(tr);

      
    });
    
  }
  if(!isReadOnly){
  var tr=$('<tr></tr>');
      keys.forEach(function(key){
        if(emptyItem[key]!= undefined){
          //if(key=="fileName"){
          //  tr.append(SetData("file",key,emptyItem));
          //}else{
            tr.append(SetData(list_evidence,key,emptyItem));
          //}
        //console.log(key+": "+item[key]);
          
          
        }
      });
        tr.append(SetData({empty:{type:"button"}},"empty",{subid:emptyItem.subId,icon:"btn-icon-green ui-icon-plus",label:"添加"},isReadOnly));
        body.append(tr);
      }
  //console.log(table.html());
  table.append(thead);
  table.append(body);
  return table.html();
}
function setProgressPopupVisisbility(isVisible){
  if (isVisible){
    $('.popup-background.popup-a').removeClass("popup-hide");
    $('#popup_progress_main').removeClass('popup-hide')
    $('#popup_progress_main').removeClass('popout').addClass('popin');
  }else{
    $('#popup_progress_main').removeClass('popin').addClass('popout');
    $('.popup-background.popup-a').addClass("popup-hide");
    //$('#popup_progress_main').delay(10000).addClass('popup-hide')
  }
}
function setUpdatePopupVisisbility(isVisible){
  if (isVisible){
    $("#popupBasic").popup("open",{
      positionTo:"window"
    });
    $('.popup-background.popup-a').addClass('popup-b');
  }else{
    $('#popupBasic').popup("close");
    $('.popup-background.popup-a').removeClass('popup-b');
  }
}
function setColumnWidth(width){
  return width!=undefined?" style='width:"+(typeof(width) == 'number'?width+"px":width)+";'":"";
}
function comparePoistion(source,target){
  return source.main==target.main && source.sub==target.sub;
}

function SetData(data,key,item,isReadOnly){
  var type=data[key].type;
  var w=setColumnWidth(data[key].width);
  var item_ele;
  var readonly=isReadOnly?' readonly="readonly"':"";
  var datarole=isReadOnly?' data-role="none"':"";
  if(type=="textarea"){
    item_ele=$("<td"+w+">"+'<textarea '+w+'  cols="40" rows="2" name="'+key+'_'+item.subid+'" id="'+key+'_'+item.subid+'" value="'+item[key]+'"'+readonly+'>'+item[key]+'</textarea>'+"</td>");

  }else if(type=="date"){
    val=item[key];
    if(val.length==0) val=new Date().toISOString().substr(0,10);
    else val=new Date(item[key]).toISOString().substr(0,10);
    item_ele=$("<td"+w+">"+'<input '+w+datarole+'  type="'+type+'" id="'+key+'_'+item.subid+'" value="'+val+'"'+readonly+'>'+"</td>");
  }else if(type=="text"){
    item_ele=$("<td"+w+">"+'<input '+w+datarole+' type="'+type+'" id="'+key+'_'+item.subid+'" value="'+item[key]+'"'+readonly+'>'+"</td>");
  }else if(type=="button"){
    item_ele=$("<td"+w+">"+'<div class="custom-border-radius">'+
    '<a href="#" data-index="'+item.subid+'" class="ui-btn '+item.icon+' ui-btn-icon-notext ui-corner-all">'+item.label+'</a></div>'+"</td>");
  }else if(type=="buttons"){
    var but_html="";
    var col_style=[];
    item.forEach((b)=>{
      but_html+='<div class="custom-border-radius">'+
      '<a href="#" data-index="'+b.subid+'" class="ui-btn '+b.icon+' ui-btn-icon-notext ui-corner-all">'+b.label+'</a></div>';
      col_style.push(b.width);
    });
    item_ele=$("<td"+" style='width:"+70+"px;'"+"><div style='display:grid;grid-template-columns:"+col_style.join(" ")+";column-gap:5px;'>"+but_html+"</div></td>");
  }else if(type=="file"){
    item_ele=$("<td"+w+">"+'<input  '+w+datarole+' type="'+type+'" id="'+key+'_'+item.subid+'" value=""'+readonly+'>'+"</td>");
  }else if(type=="tel"){
    item_ele=$("<td"+w+">"+'<input  '+w+datarole+' type="'+type+'" id="'+key+'_'+item.subid+'" value="'+item[key]+'"'+readonly+'>'+"</td>");
  }else if(type=="combobox"){
    
    item_ele=$("<td"+w+"></td>");
    if(isReadOnly){
      val=item[key];
      if(data[key].data){
        data[key].data.forEach((d,counter)=>{
          var selected='';
          if(counter==item[key])
            val=d;
        });
      };
      item_ele.append($('<input  '+w+datarole+' type="text" id="'+key+'_'+item.subid+'" value="'+val+'"'+readonly+'>'));
    }else{
      var selectItem=$('<select id="'+key+'_'+item.subid+'" value="'+item[key]+'" '+readonly+'></select>');
    
      if(data[key].data){
        data[key].data.forEach((d,counter)=>{
          var selected='';
          if(counter==item[key])
            selected=' selected="selected"';
          selectItem.append($('<option value="'+counter+'"'+selected+'>'+d+'</option>'));
        });
      }
      //console.log(selectItem.html());
      item_ele.append(selectItem);
    }
    
  }
  return item_ele;
}
function formatSatusIndex(status){
  status=Number(status);
  var main=Math.floor(status);
  var sub=Math.round((status-main)*10);
  return {main:main,sub:sub};
}
function progressDetailsPopup(data,isReadOnly,parent){
  popup_details_form=new mform({template:progress_form_template});
  parent.empty();
  parent.append(popup_details_form.instance);
  console.log("formatSatusIndex.........................");
  console.log(data);
  //$(popup_details_form.instance).setData(data,progress_form_template.template);
  popup_details_form.setData(data).readOnly(isReadOnly);
  parent.trigger('create');
}
function setElementDisableByReadonly(isReadOnly){
  
  if(isReadOnly){
    $("#process_save_but").addClass('ui-state-disabled');
    
    $("#process_update_save_but").addClass('ui-state-disabled');
    $(".ui-but-lock").removeClass('btn-icon-green').addClass('btn-icon-red');
    //$("#progress_status_details").find('input').attr('readonly',true);
    //$("#progress_status_details").find('input').jqmData('role',"none");
    
    //$("#progress_status_details").find('input').attr('data-role', 'none');
    //$("#progress_status_details").find('input').addClass('input-readOnly');
    //$("#progress_status_details").trigger('create');

  }else{
    $("#process_save_but").removeClass('ui-state-disabled');
    
    $("#process_update_save_but").removeClass('ui-state-disabled');
    $(".ui-but-lock").removeClass('btn-icon-red').addClass('btn-icon-green');
    
    //$("#progress_status_details").find('input').attr('readonly',false);
    //$("#progress_status_details").find('input').removeClass('input-readOnly');
    //$("#progress_status_details").trigger('create');
  }
}


