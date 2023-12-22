
var _data={
    //template:["立案","一审","二审","执行","结案","再审","监督"],
    basic:{
        id:1,caseNo:"A202311110005",caseName:"管文波离职案件",caseLabel:2,caseReason:0,caseType:0,caseBelong:0,applicant:"张国庆",
        caseCause:6,createDate:"2023-08-11 14:03:19",casePersonnel:"公司1,个人0",case2ndParty:"李四",isReadOnly:true,caseLawsuitRequest:"",caseCounterclaimRequest:"",caseSum:"",caseLawsuit:500,caseCounterclaim:0
    },
    progressStatus:{
        id:1,caseNo:"A202311110005",caseLegal:"贺璐璐",caseLawfirm:"",caseAttorney:"",courtDate:"2023-09-11 14:00:00",
        penaltyAmount:500.00,exexuteAmount:243.00,caseStatus:4.1,courtName:1,caseOrgnizationPersonnel:"法官1,其他0"
        ,data:[
            {id:1,subid:0,caseStatusId:0,caseNo:"A202311110005",caseUpdated:"23.9.28送达一审判决书",caseDisputed:"",dateUpdated:"2023-11-01 14:00:00",dateOccur:"2023-09-28 14:00:00"},
            {id:1,subid:1,caseStatusId:0,caseNo:"A202311110005",caseUpdated:"23.10.13送达判决书",caseDisputed:"",dateUpdated:"2023-11-02 14:00:00",dateOccur:"2023-10-13 14:00:00"},
            {id:1,subid:0,caseStatusId:1,caseNo:"A202311110005",caseUpdated:"23.10.28送达二审判决书",caseDisputed:"",dateUpdated:"2023-12-01 14:00:00",dateOccur:"2023-10-28 14:00:00"}
        ]
    },
    excuteStatus:[
        {id:1,subId:0,caseStatusId:3.1,caseNo:"A202311110005",personExecuted:"张三",personContact:18612221231,purposeExecute:"财产",exexuteAmount:200,sumExecuted:"",filePath:"",dateExecuted:"2023-12-11 14:00:00"},
        {id:1,subId:1,caseStatusId:3.1,caseNo:"A202311110005",personExecuted:"张五",personContact:1572312534,purposeExecute:"",exexuteAmount:34,sumExecuted:"",filePath:"",dateExecuted:"2023-12-21 14:00:00"},
    ],
    propertyStatus:[
        {id:1,caseNo:"A202311110005",caseStatusId:3.1,subId:0,propertyName:"未知",propertyStatus:1,dateUpdated:"2023-12-01 14:00:00",dateOccur:"2023-12-01 14:00:00"},

    ],
    attachments:[
        {id:1,evidenceId:0,caseStatusId:0,caseNo:"A202311110005",numFile:2,numCPage:5,numCopy:1,numOriginal:1,fileName:"审判决书",filePath:"",dateUploaded:"2023-11-01 14:00:00"},
    ]
}
function getStageList(stageIdx,data){
    var stageIndex=formatIndex(stageIdx);
    var caseUpdateData=data.updates.filter((item) => formatIndex(item.caseStatus).main==stageIndex.main && formatIndex(item.caseStatus).sub==stageIndex.sub);
    var caseExcuteData=data.excutes.filter((item) => formatIndex(item.caseStatus).main==stageIndex.main && formatIndex(item.caseStatus).sub==stageIndex.sub);
    var casePropertyData=data.properties.filter((item) => formatIndex(item.caseStatus).main==stageIndex.main && formatIndex(item.caseStatus).sub==stageIndex.sub);
    var caseAttachmentData=data.attachments.filter((item) => formatIndex(item.caseStatus).main==stageIndex.main && formatIndex(item.caseStatus).sub==stageIndex.sub);
    //console.log("getStageList",caseUpdateData);
    var newData=caseUpdateData.concat(caseExcuteData,casePropertyData,caseAttachmentData);
    //console.log('getFlowList',stageIdx,newData);
    if(newData.length>0)
        return newData;
    else return [];
}

function getFlowList(data){
    var caseData=data.basic;
    var flowList=[];
    flowList.push({
        label:"立案",
        date:caseData.caseDate,
        id:0,
        data:getStageList(0,data)
    });
    //console.log('formatIndex....',progresses);
    if(progresses!=undefined){//---progresses需要植入到data
        progresses.forEach((stage,idx)=>{
            var index=idx;
            switch(stage){
                case "一审":
                    flowList.push({
                        label:stage,
                        date:caseData.FirstInstance,
                        id:index,
                        data:getStageList(index,data)
                    });
                    break;
                case "二审":
                    flowList.push({
                        label:stage,
                        date:caseData.SecondInstance,
                        id:index,
                        data:getStageList(index,data)
                    });
                    break;
                case "执行":
                    //console.log('progresses....',progresses)
                    
                    
                    break;
                case "结案":
                    flowList.push({
                        label:stage,
                        id:index,
                        data:getStageList(index,data)
                    });
                    break;
                case "再审":
                    flowList.push({
                        label:stage,
                        id:index,
                        data:getStageList(index,data)
                    });
                    break;
                case "监督":
                    flowList.push({
                        label:stage,
                        id:index,
                        data:getStageList(index,data)
                    });
                    break;
                default:
                    var statusId=index+formatIndex(caseData.caseStatus).sub/10;

                    //console.log('formatIndex....',getStatusLabel(statusId,progresses))
                    flowList.push({
                        label:Number(caseData.caseStatus)>index?getStatusLabel(statusId,progresses):"",
                        id:index,
                        data:getStageList(statusId,data)
                    });
                    break;
            }
        })
    }
    //console.log('data............',data);
    //console.log('getFlowList1............',flowList);
    return [flowList];
}


function timelinePage(arg){
    this.opt = {
        template:undefined,
        data:undefined,
        canvas:undefined,
        summaryListContainer:undefined
    }
    extend(this.opt,arg);
    
    if(this.opt.data!=undefined && this.opt.canvas!=undefined){
        this.ctx=this.opt.canvas.getContext('2d');
        this.setTimeline(this.opt.data,this.opt.canvas);
    }
    
    if(this.opt.template!=undefined && this.opt.data!=undefined && this.opt.summaryListContainer!=undefined){
        this.setSumList(this.opt.template,this.opt.data,this.opt.summaryListContainer);
    }
    
    function extend(opt1,opt2){
        for(var attr in opt2){
            //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
            opt1[attr] = opt2[attr];
        }
    }
}
timelinePage.prototype.setTimeline=function(data,canvas){
    if (data==undefined) data=this.opt.data;
    if (canvas==undefined) canvas=this.opt.canvas;
    
    if (this.ctx==undefined) this.ctx=this.opt.canvas.getContext('2d');
    this.flowList=getFlowList(data);
    var _this=this;
    //console.log('canvas.height--------------------------->');
   // console.log(canvas.height);
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTimeline(data,this.ctx,this.flowList).forEach((circle)=>{
        //console.log(Object.getPrototypeOf(circle))
        //console.log(Object.keys(Object.getPrototypeOf(circle)).includes('addListener'));

        circle.addListener('click',function(e){
            console.log(this.sourceData.label+" ["+this.sourceData.index+"]--"+e.type);
            //dataList=[];
            var datas=_this.flowList.filter((item)=>item.id==this.sourceData.index);
            if(datas.length>0 && datas[0].data!= undefined && datas[0].data.length>0){
                $('#event_list').children().remove();
                $('#event_list_title').text(this.sourceData.label);
                datas[0].data.forEach((ite)=>{
                    var _data=getEventsDetails(ite);
                    var date_bar=$('<li data-role="list-divider">'+_data.date+'</li>');
                    if(ite.hasOwnProperty('evidenceId'))
                    var item_container=$('<li'+(ite.hasOwnProperty('evidenceId')?' data-icon="eye" class="btn-icon-green"':'')+'></li>');
                    var list_item=$('<label>'+_data.description+'</label>');
                    item_container.append(list_item);
                    $('#event_list').append(date_bar);
                    
                    $('#event_list').append(item_container);
                });
                //$('#event_list').append();
                //$('#event_list').remove();
                //$('#event_panel').append($('#event_list'));
                $( "#event_panel" ).trigger( "updatelayout" );
                $('#event_list').listview('refresh');
                $( "#event_panel" ).panel( "open" );
                //$.mobile.navigate( '#event_panel');
                //$('#popupDialog').popup("open");
            }
            
        })
        circle.addListener('mouseover',function(e){
            //console.log(this.sourceData.label+" ["+this.sourceData.index+"]--"+e.type);
            var datas=_this.flowList.filter((item)=>item.id==this.sourceData.index);
            if(datas.length>0 && datas[0].data!= undefined && datas[0].data.length>0){
                $(canvas).css({cursor:"pointer"});
            }else{
                $(canvas).css({cursor:"default"});
            }
            
            e.ctx.globalCompositeOperation = "source-over";
        })
        circle.addListener('mouseout',function(e){
            //console.log(this.sourceData.label+" ["+this.sourceData.index+"]--"+e.type);
            $(canvas).css({cursor:"default"});
        })
    });
}
timelinePage.prototype.setSumList=function(_summary_template,_data,containerId){
    
    if (_summary_template==undefined) _summary_template=this.opt.template;
    if (_data==undefined) _data=this.opt.data;
    if (containerId==undefined) containerId=this.opt.summaryListContainer;
    Object.keys(_summary_template).forEach(key=>{
        var collapsibleset=$('<div data-role="collapsible" data-theme="b" data-collapsed="false" ></div>');
        var collapsibleLabel=$('<h3>'+_summary_template[key].label+'</h3>');
        collapsibleset.append(collapsibleLabel);
        var listview=$('<ul data-role="listview" data-theme="a" data-inset="false"></ul>');
        collapsibleset.append(listview);
        $(containerId).append(collapsibleset);
        Object.keys(_summary_template[key].data).forEach(sub_key=>{
            $.each(Object.keys(_data),function(index,data_key){
                    //console.log(data_key+"--"+sub_key,_data);
                if (data_key!="template" && Object.keys(_data[data_key]).includes(sub_key)){
                    var item=_summary_template[key].data[sub_key];
                    var data=item.data;
                    var type=item.type;
                    var label=item.label;
                    
                    var val=_data[data_key][sub_key];
                    //console.log(_data);
                    
                    var isMultiValue=false;
                    var multiValues=[];
                    if(data!=undefined){
                        //console.log('setSumList',sub_key,data,val);
                        if(data instanceof Array){
                            //console.log('setSumList',sub_key,val);
                            if(item.hasOwnProperty('displayFormat') && item.hasOwnProperty('valueKey')){
                                var displayFormat=item.displayFormat;
                                //console.log('setSumList',$.grep(data,(d)=>d[item.value]==val));
                                var matched=$.grep(data,(d)=>d[item.valueKey]==val);
                                if(matched.length>0){
                                    $.each(matched[0],(kk,vv)=>{
                                        //console.log(kk+"----displayFormat--->"+(item.displayFormat.indexOf(kk)>-1));
                                        if(item.displayFormat.indexOf(kk)>-1){
                                            displayFormat=displayFormat.replace("{"+kk+"}",vv);
                                        }
                                    })
                                    val=displayFormat;
                                }
                                
                            }else{
                                var v=val.toString().split('.');
                                //console.log(v);
                                if(v.length>1){
                                    val=data[v[0]][v[1]];
                                }else if(v.length==1){
                                    
                                    val=data[v[0]];
                                }
                            }
                            
                        }
                        else{
                            isMultiValue=true;
                            var values=val.split(",");
                            if(type=="supermulticombobox"){
                                values.forEach(_v=>{
                                    var _values=formatSuperMultiSelectOptionValue(_v);
                                    //console.log('setSumList',_values);
                                    if(_summary_template[key].data[sub_key].hasOwnProperty('displayFormat')){
                                        var displayFormat=_summary_template[key].data[sub_key].displayFormat;
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

                            }else if(type=="supermultiinput"){
                                values.forEach(_v=>{
                                    var _values=formatSuperMultiSelectData(_v);
                                    //console.log('setSumList',_values);
                                    if(_summary_template[key].data[sub_key].hasOwnProperty('displayFormat')){
                                        var displayFormat=_summary_template[key].data[sub_key].displayFormat;
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

                            }else if(type=='multicombobox'){
                                var keys=Object.keys(data)
                                values.forEach(_v=>{
                                    var matchedKey=$.grep(keys,key=>_v.indexOf(key)>-1);
                                    //console.log(matchedKey);
                                    if(matchedKey.length>0){
                                        if(item.valueKey!=undefined){
                                            //console.log(data[matchedKey[0]],item.valueKey);
                                            $.each(data[matchedKey[0]],(_i,_d)=>{
                                                //console.log(_d,_v.replace(matchedKey[0],''));
                                                if(_d[item.valueKey].toString()==_v.replace(matchedKey[0],'')){
                                                    if(item.hasOwnProperty('displayFormat')){
                                                        var displayFormat=item.displayFormat;
                                                        $.each(_d,(kk,vv)=>{
                                                            if(displayFormat.indexOf(kk)>-1){
                                                                displayFormat=displayFormat.replace("{"+kk+"}",vv);
                                                            }
                                                        })
                                                        multiValues.push(displayFormat);
                                                    }else{
                                                        var collector=[];
                                                        $.each(_d,(kk,vv)=>{
                                                            collector.push(vv);
                                                        })
                                                        multiValues.push(collector.join(" "));
                                                    }
                                                }
                                            })
                                            
                                            //var matchedData=$.grep(data[matchedKey[0]],(d=>d[item.valueKey].toString()==_v.replace(matchedKey[0],'')));
                                            //console.log('matchedData',matchedData);
                                        }
                                    }
                                });
                            }else{
                                //var _values=formatSuperMultiSelectOptionValue(v);
                                //console.log('setSumList',_values);
                                $.each(data,(k,v)=>{
                                    //console.log('setSumList',v);
                                    //console.log(v);
                                    if(v instanceof Array){
                                        v.forEach((_val,index)=>{
                                            
                                            if(_val instanceof Object){
                                                if(values.includes(_val.value)){
                                                    multiValues.push(_val.name);
                                                }
                                            }else{
                                                
                                                
                                            }
                                        });
                                        if(multiValues.length==0){
                                            values.forEach(_v=>{
                                                //var _values=formatSuperMultiSelectOptionValue(_v);

                                                //console.log(_v.indexOf(k));
                                                if(_v.indexOf(k)>-1){
                                                    multiValues.push(data[k][parseInt(_v.replace(k,""))]);
                                                    return false;
                                                }
                                                
                                            });
                                        }
                                        //console.log(values);
                                        
                                    }else{
                                        
                                        //console.log();
                                        
                                    }
                                    
                                })
                            }
                            
                            
                        }
                    }
                    //console.log(data_key+"-->"+sub_key+"--->"+multiValues+"------------------");
                    if(isMultiValue){
                        var _collapsibleset=$('<div data-role="collapsible" data-theme="a" data-iconpos="right" data-inset="false" class="collapsible-listview" style="border:none;margin-right:-45px;" data-collapsed-icon="carat-d" data-expanded-icon="carat-u"></div>');
                        var _collapsibleLabel=$('<h4 class="ui-field-contain" style="margin:0px;border:none;"><div style="display:grid;grid-template-columns: auto 1fr;column-gap: 9px;margin-left:-3px"><label style="margin-top:2px;margin-bottom:-2px;">'+
                            label+'</label><label style="margin-top:2px;margin-bottom:-2px;width:250px;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">'+multiValues.join(",")+'</label></div><span class="ui-li-count">'+multiValues.length+'</span></h4>');
                        _collapsibleset.append(_collapsibleLabel);
                        var _listview=$('<ol data-role="listview" data-theme="b"> </ol>');
                        _collapsibleset.append(_listview);
                        if(multiValues.length>1){
                            multiValues.forEach(v=>{
                                var _li=$('<li class="ui-field-contain"></li>');
                                var _info_ele=$('<label>'+v+'</label>');
                                _li.append(_info_ele);
                                _listview.append(_li);
                            });
                            var label_ele=$('<label>'+label+'</label>');
                            var li=$('<li class="ui-field-contain" style="padding-top:0px;padding-bottom:0px;border:none;"></li>');
                            //li.append(label_ele);
                            li.append(_collapsibleset);
                            listview.append(li);
                        }else{
                            var label_ele=$('<label>'+label+'</label>');
                            var li=$('<li class="ui-field-contain"></li>');
                            li.append(label_ele);
                            li.append('<label>'+multiValues[0]+'</label>');
                            listview.append(li);
                        }
                        
                        //console.log('listview.html()');
                        //console.log(listview.html());
                    }else{
                        //console.log(val);
                        if(val==null) val="尚未设定"
                        var li=$('<li class="ui-field-contain" style="word-wrap: break-word;white-space : normal"></li>');
                        
                        var label_ele=$('<label>'+label+'</label>');
                        var info_ele=$('<label style="width:310px;">'+val+'</label>');
                        
                        li.append(label_ele);
                        if(sub_key=="caseLabel"){
                            //console.log(val);
                            //console.log(resourceDatas['caseLabelsColors']);
                            li.css(resourceDatas['caseLabelsColors'][val]);
                            li.css({'text-align':'left'});
                        }else if(sub_key=="caseStatus"){
                            info_ele=$('<div id="'+sub_key+'" style="position: absolute;left:110px;"></div>');
                            
                        }
                        li.append(info_ele);
                        listview.append(li);
                        if(sub_key=="caseStatus"){
                            var newProgress=[];
                            progresses.forEach((prog=>{
                                if(prog instanceof Array){
                                    newProgress.push({name:"正在执行",data:prog});
                                }else{
                                    newProgress.push(prog);
                                }
                            }))
                            //console.log("caseStatus................."+_data[data_key][sub_key]);
                            var but=new ProgressesButton({
                                steps:resourceDatas["caseStatus_object"],
                                deadSteps:deads,
                                selected_color:"#4B9DCB",
                                showLabel:true,
                                containerId:'#'+sub_key,
                                currentPosition:_data[data_key][sub_key],
                                fontSize:12,
                                line_size:2,
                                size:12,
                                width:240,
                                isViewMode:true,
                                verticalGap:2,
                                labelPosition:"bottom",
                                showSubSteps:false,
                                readOnly:true,
                            });
    
                        }
                    }
                    //console.log(val);
                    
                    //if (sub_key=="caseNo") console.log(data_key);
                    return false;
                }else if(data_key==sub_key && data_key=='attachments'){
                    $.each(_data[data_key],(index,attachment)=>{
                        //console.log(getStatusLabel(attachment.caseStatus,resourceDatas["caseStatus_object"]));
                        attachment.caseStatus=getStatusLabel(attachment.caseStatus,resourceDatas["caseStatus_object"]);
                        //console.log(_summary_template[key].data);
                        if(_summary_template[key].data.displayFormat!=undefined){
                            var displayFormat=_summary_template[key].data.displayFormat;
                            $.each(attachment,(k,v)=>{
                                displayFormat=displayFormat.replace('{'+k+'}',v);
                            })
                            //console.log(displayFormat);
                            var li=$('<li class="ui-field-contain" style="word-wrap: break-word;white-space : normal"></li>');
                        
                            var label_ele=$('<label>'+attachment.caseStatus+'</label>');
                            li.append(label_ele);
                            var item=$('<label style="width:310px;">'+displayFormat+'</label>');
                            
                            li.append(item);
                            listview.append(li);
                        }
                    })
                }
                
            });
        });
        $(containerId).find('select').parent().addClass('select-overflow');
    });
}
