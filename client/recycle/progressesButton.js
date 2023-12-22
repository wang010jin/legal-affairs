function extend(opt1,opt2){
    for(var attr in opt2){
        //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
        opt1[attr] = opt2[attr];
    }
}
function getStatusLabel(status,template){
    var status_data=status instanceof Object?status:formatIndex(status);
    var label=undefined;
    template.forEach((stageLabel,index)=>{
        
        if(index==status_data.main) {
            if(stageLabel instanceof Array){
                //console.log('stageLabel',stageLabel);
                label=stageLabel[Number(status_data.sub)];
                return false;
            }else{

                label = stageLabel;
                return false;
            }
        }
        
    });
    return label;
}
function compareStatus(source,target){
    var _source=formatIndex(source);
    var _target=formatIndex(target);
    return _source.main==_target.main && _source.sub==_target.sub;
}
function ProgressesButton(arg){
    this.body=document.body;
    this.opt = {
        background_color : "lightgray",
        selected_color:"#1362B7",
        currentPosition:0,
        currentSubPosition:0,
        width:440,
        steps:[],
        deadSteps:[],
        size:10,
        fontSize:12,
        line_size:4,
        containerId:undefined,
        showLabel:true,
        dataId:-1,
        duration:300,
        isViewMode:false,
        verticalGap:Number.NaN,
        labelPosition:"center",
        showSubSteps:true,
        readOnly:false,
        hasShadow:false,
        showCounter:false,
        counterData:[],
    }
    this.init(arg)
}

ProgressesButton.prototype.init=function(arg){
    //console.log("init.............."+this.opt.labelPosition);
    var _this=this;
    extend(this.opt,arg);
    this.dataId=this.opt.dataId;
    if (_this.opt.containerId!=undefined) this.parent=$(_this.opt.containerId);
    //if(this.instance!=null) this.instance.remove();
    //console.log(_this.opt.containerId);
    
    this.steps=_this.opt.steps;
    var step=parseInt((_this.opt.width-_this.opt.size*2)/(_this.steps.length-1));
    this.step=step;
    //console.log("step: "+(step*this.opt.currentPosition-_this.opt.size));
    if(this.instance==null){
        this.instance=getElement("",{
            'width':_this.opt.width+'px',
        });
    }else{
        this.instance.children().remove();
    }
    
    this.outter_frame=getElement("outter",{
    });
    this.breakpoint=[];
    this.items=[];
    var v_dist=_this.opt.size*1.5;
    var top_start=(_this.opt.size+_this.opt.line_size/2);
    var top_offset=_this.opt.size-_this.opt.line_size/2;
    var tops=[top_start];
    var lefts=[top_start]
    var v_gap=Number.isNaN(_this.opt.verticalGap)?(step-_this.opt.size*2):_this.opt.verticalGap;
    var v_step=_this.opt.size*2+v_gap;
    var arrayIndex=[];
    if(!_this.opt.showSubSteps){
        
            _this.steps.forEach(function(step_item,index){
                if(step_item instanceof Array){
                    //_this.steps[index]="执行"
                    arrayIndex.push(index);
                }
                //arrayIndex.push(index);
            });
            _this.steps = $.grep(_this.steps,function (step){
                return !(step instanceof Array);
            });
        
    }
    _this.steps.forEach(function(step_item,index){
        if(index>0){
            //var line_left=_this.opt.size+step*(index-1);
            lefts.push(_this.opt.size+step*(index));
            //console.log(index+"-"+step_item+": "+line_left);
            
        }
        if(step_item instanceof Array){
            _this.breakpoint.push(index);
            step_item.forEach(function(sub_step,i){
                var last_top=tops[tops.length-1];
                tops.push(last_top+v_step);
            });
        }else{

        }
    });   
    //console.log(tops);
    //console.log(tops[tops.length-2]/2);
    //console.log(lefts);
    var v_h=v_step;
    var middle_line=(tops[tops.length-2]+top_offset)/2
    
    if(tops.length==1){
        middle_line=tops[0];
    }
    //this.instance.css({height:(tops[tops.length-2]+_this.opt.size+_this.opt.line_size*2)+"px"});
    //console.log("H: "+(tops[1]-tops[0])+"--W: "+step+"="+Math.sqrt(v_h*v_h+step*step));
    var drawNextLine=true;
    _this.steps.forEach(function(step_item,index){
        if(step_item instanceof Array){
            
            option_index=index;
            step_item.forEach(function(sub_step,i){
                var p_index=Math.round(Math.abs(middle_line-(tops[i]-_this.opt.line_size/2))/v_step);
                var height=v_h*p_index;
                var long_edge=Math.sqrt(height**2+step**2);
                var angle=-parseInt(bevel(height,long_edge));
                if((tops[i]-_this.opt.line_size/2)>middle_line) angle=Math.abs(angle);
                //console.log(sub_step+": "+middle_line+"--->"+(tops[i]-_this.opt.line_size/2)+"---"+angle);
                _this.outter_frame.append(getElement("progress-but-background-line ",{
                    'background':_this.opt.background_color,
                    'width':long_edge+'px',
                    'height':_this.opt.line_size+'px',
                    'left':(lefts[index-1])+'px',
                    'top':(middle_line)+'px',
                    'transform':"rotate("+(angle)+"deg)",
                    "transform-origin": "left center",
                }));

                //#region sub visible pre line
                var sub_selected_line=getElement("progress-but-background-line progress-but-indicator-selected selected-line"+(index)+"-"+(i)+" main-index"+index+" sub-index"+i,{
                    'background':_this.opt.selected_color,
                    'width':(_this.isSelectable(index,i)?long_edge:0)+'px',
                    'height':_this.opt.line_size+'px',
                    'left':(lefts[index-1])+'px',
                    'top':(middle_line)+'px',
                    'transform':"rotate("+(angle)+"deg)",
                    "transform-origin": "left center",
                })
                
                sub_selected_line.attr("id","selected-line"+(index)+"-"+(i));
                sub_selected_line.data("width",long_edge);
                
                sub_selected_line.on('click',async function(e){
                    console.log(e.currentTarget);
                    
                });
                _this.outter_frame.append(sub_selected_line);
                //#endregion
                //console.log(_this.opt.deadSteps);
                if(!_this.opt.deadSteps.includes(sub_step)){
                    angle=-parseInt(bevel(step,long_edge)-90);
                    if((tops[i]-_this.opt.line_size/2)>middle_line) angle=Math.abs(angle);
                    _this.outter_frame.append(getElement("progress-but-background-line ",{
                        'background':_this.opt.background_color,
                        'width':long_edge+'px',
                        'height':_this.opt.line_size+'px',
                        'left':(lefts[index])+'px',
                        'top':(tops[i]-_this.opt.line_size/2)+'px',
                        'transform':"rotate("+(angle)+"deg)",
                        "transform-origin": "left center",
                    }));

                    //#region sub visible next line
                    if((tops[i]-_this.opt.line_size/2)>middle_line) angle=Math.abs(angle);
                    sub_selected_next_line=getElement("progress-but-background-line progress-but-indicator-selected selected-line"+(index+1)+"-"+(i)+" main-index"+(index+1)+" sub-index"+i,{
                        'background':_this.opt.selected_color,
                        'width':(_this.isSelectable(index+1,i)?long_edge:0)+'px',
                        'height':_this.opt.line_size+'px',
                        'left':(lefts[index])+'px',
                        'top':(tops[i]-_this.opt.line_size/2)+'px',
                        'transform':"rotate("+(angle)+"deg)",
                        "transform-origin": "left center",
                    });
                    sub_selected_next_line.attr("id","selected-line"+(index+1)+"-"+(i));
                    sub_selected_next_line.data("width",long_edge);
                    sub_selected_next_line.on('click',async function(e){
                        //console.log(e.currentTarget);
                        
                    });
                    _this.outter_frame.append(sub_selected_next_line);
                    //#endregion

                    drawNextLine=false;
                }
                //#region Sub Indicators
                /*******************************/
               /*       Sub Indicators        */
              /*******************************/
                var frame =getElement("progress-but-frame",{
                    'left':(lefts[index]-_this.opt.size)+'px',
                    'top':(tops[i]-_this.opt.size)+'px',
                });
                var sub_indicator=getElement("progress-but-background-indicator main-indicator-index"+index+" sub-index-"+i,{
                    'background':_this.opt.background_color,
                    'width':_this.opt.size*2+'px',
                    'height':_this.opt.size*2+'px',
                    "borderRadius":(_this.opt.size)+"px",
                    "fontSize":_this.opt.fontSize+'px',
                },_this.opt.showLabel&&_this.opt.labelPosition=="center"?(_this.opt.fontSize+4>=_this.opt.size?sub_step.substring(0,1):sub_step):"");
                //console.log(sub_step+"-->"+sub_step.substring(1));
                sub_indicator.data("sub-index",i);
                sub_indicator.data("main-index",index+i/10);
                //if(_this.opt.readOnly) sub_indicator.css({"cursor":"default"});
                sub_indicator.data("isMainIndicator",false);
                sub_indicator.data("preLineId","selected-line"+(index)+"-"+(i));
                sub_indicator.data("nextLineId","selected-line"+(index+1)+"-"+(i));
                if(_this.opt.hasShadow) sub_indicator.addClass('progress-but-shadow');
                //console.log(index+"<"+(_this.opt.currentPosition+1)+"--"+step_item);
                //setselectable(sub_indicator,index<=_this.opt.currentPosition+1);
                //console.log(Math.floor(_this.opt.currentPosition));
                //var isSelectable=Math.round((_this.opt.currentPosition-Math.floor(_this.opt.currentPosition))*10)==i
                _this.setState(sub_indicator,index,i);
                _this.items.push(sub_indicator);
                sub_indicator.on('click',clickedEvent);
                frame.append(sub_indicator)

                var label =getElement("progress-but-label",{
                    "fontSize":_this.opt.fontSize+'px',
                },_this.opt.showLabel&&_this.opt.labelPosition!="center"?sub_step:"");
                frame.append(label)
                _this.outter_frame.append(frame);
                
                setCounterIndecator(lefts[index],tops[i],index,i);
                //#endregion
            });
            
            _this.outter_frame.append(getElement("progress-but-background-indicator main-indicator-index"+index,{
                'display':'none',
                'background':_this.opt.background_color,
                'width':_this.opt.size*2+'px',
                'height':_this.opt.size*2+'px',
                "borderRadius":(_this.opt.size)+"px",
                "fontSize":_this.opt.fontSize+'px',
                'left':(lefts[index]-_this.opt.size)+'px',
                'top':(middle_line+_this.opt.line_size/2-_this.opt.size)+'px',
            },step_item));
        }else{
            var realIndex=index;
            if(!_this.opt.showSubSteps){

                    if(realIndex>1)
                        realIndex+=1;
                
            }
            //#region Main Indicators
              /********************************/
             /*       Main Indicators        */
            /********************************/
            var frame =getElement("progress-but-frame",{
                'left':(lefts[index]-_this.opt.size)+'px',
                'top':(middle_line+_this.opt.line_size/2-_this.opt.size)+'px',
            });
            var indicator=getElement("progress-but-background-indicator main-indicator-index"+realIndex+1,{
                'background':_this.opt.background_color,
                'width':_this.opt.size*2+'px',
                'height':_this.opt.size*2+'px',
                "borderRadius":(_this.opt.size)+"px",
                "fontSize":_this.opt.fontSize+'px',
            },_this.opt.showLabel&&_this.opt.labelPosition=="center"?(_this.opt.fontSize+4>=_this.opt.size?step_item.substring(0,1):step_item):"");
            $(indicator).data("main-index",realIndex);
            indicator.data("isMainIndicator",true);
            if(_this.opt.hasShadow) indicator.addClass('progress-but-shadow');
            if(realIndex<=_this.opt.currentPosition && (arrayIndex.includes(realIndex+1)||_this.breakpoint.includes(realIndex+1))) {

            }else{
                //if(_this.opt.readOnly) indicator.css({"cursor":"default"});
            }
            indicator.data("preLineId","selected-line"+(realIndex));
            //setselectable(indicator,index<=_this.opt.currentPosition+1);
            _this.setState(indicator,realIndex,-1);
            
            _this.items.push(indicator);
            indicator.on('click',clickedEvent);
            frame.append(indicator)

            var label =getElement("progress-but-label",{
                "fontSize":_this.opt.fontSize+'px',
            },_this.opt.showLabel&&_this.opt.labelPosition!="center"?step_item:"");
            frame.append(label)
            
            _this.outter_frame.append(frame);
            setCounterIndecator(lefts[index],middle_line,realIndex);
            
            //#endregion
        }
        if(index+1<_this.steps.length && drawNextLine){
            //var line_left=_this.opt.size+step*(index-1);
            //lefts.push(_this.opt.size+step*(index-1));
            //console.log(index+"-"+step_item+": "+lefts[index]);
            
            if(_this.breakpoint.includes(index+1)){
                var selected_line=getElement("progress-but-background-line progress-but-indicator-selected main-index"+realIndex,{
                    'display':'none',
                    'background':_this.opt.selected_color,
                    'height':_this.opt.line_size+'px',
                    'width':'0px',
                    'left':lefts[index]+'px',
                    'top':(middle_line)+'px',
                });
                _this.outter_frame.append(selected_line);
            }else{
                _this.outter_frame.append(getElement("progress-but-background-line",{
                    'background':_this.opt.background_color,
                    'height':_this.opt.line_size+'px',
                    'width':(step)+'px',
                    'left':lefts[index]+'px',
                    'top':(middle_line)+'px',
                }));
                //#region main visible line
                var selected_line=getElement("progress-but-background-line progress-but-indicator-selected selected-line"+(realIndex+1)+" main-index"+realIndex,{
                    'background':_this.opt.selected_color,
                    'height':_this.opt.line_size+'px',
                    'width':(index+1<=_this.opt.currentPosition?step:0)+'px',
                    'left':lefts[index]+'px',
                    'top':(middle_line)+'px',
                });
                
                selected_line.data("width",step);
                selected_line.attr("id","selected-line"+(realIndex+1));
                selected_line.on('click',async function(e){
                    //console.log(e.currentTarget);
                    
                    
                });
                //#endregion
                _this.outter_frame.append(selected_line);
            }
            
            
        }else{
            var selected_line=getElement("progress-but-background-line progress-but-indicator-selected main-index"+index,{
                'display':'none',
                'background':_this.opt.selected_color,
                'height':_this.opt.line_size+'px',
                'width':'0px',
                'left':lefts[index]+'px',
                'top':(middle_line)+'px',
            });
            _this.outter_frame.append(selected_line);
            
           //console.log(breakpoint);
           //console.log(index);
            drawNextLine=true;
        }
        
    });  
    //console.log("this items length..........."+_this.items.length);
    _this.instance.append(_this.outter_frame); 
    if(this.parent!=undefined) this.parent.append(this.instance);
    //return this;
    async function clickedEvent(e){
        
        if(_this.opt.isViewMode&&$(e.currentTarget).data('canSelect')){
            $(_this.outter_frame).trigger({type:'itemOnClicked', Position:formatIndex($(e.currentTarget).data('main-index')),
                        dataId:_this.dataId, target:$(e.currentTarget),event:e});
        }
        if($(e.currentTarget).data('canSelect')&&!_this.opt.isViewMode){
            //await _this.setProgress($(e.currentTarget).data('index'),_this.opt.duration);
            await _this.setFlow($(e.currentTarget),_this.opt.duration,!$(e.currentTarget).data('isMainIndicator'));
        }
    }
    function setCounterIndecator(left,top,index,sub){
        if(_this.opt.showCounter && _this.opt.counterData.length>0){
            
            var _counter=_this.opt.counterData.filter(value=>{ 
                if(sub==undefined)
                    return formatIndex(value.caseStatus).main==(index);
                else
                    return value.caseStatus==index+sub/10
            });
            //console.log('setCounterIndecator',_counter.length,index,_counter);
            
            var size=_this.opt.size*2*0.4;
            var counter=getElement("progress-but-counter",{
                width:(size)+"px",
                height:(size)+"px",
                "line-height":size+"px",
                "fontSize":_this.opt.fontSize*0.9+'px',
                "fontWeight":700,
                "borderRadius":(size*0.5)+"px",
                'left':(left+_this.opt.size*0.5)+'px',
                'top':(top-_this.opt.size*1.2)+'px',
            },_counter.length);
            $(counter).data('index',(index+(sub==undefined?0:sub)/10));
            _this.outter_frame.append(counter)
            if(_counter.length==0){
                counter.hide();
            }else{
                counter.show();
            }
        }
    }
    function getElement(className,css,text){
        if(text==null) text="";
        var element=$("<div><span>"+text+"</span></div>");
        element.addClass(className);
        element.css(css);
        return element;
    }
    function bevel(straight,oblique){
        const sinOfAngleX = straight / oblique;
        return Math.round((Math.asin(sinOfAngleX)*180)/Math.PI);
    }
}
ProgressesButton.prototype.updateCounterIndicator=function(data){
    
    console.log('updateCounterIndicator',this.instance.find('.progress-but-counter'));
    var counter=$.grep(this.instance.find('.progress-but-counter'),(cunter)=>{
        console.log('updateCounterIndicator', $(cunter).data('index'),data.caseStatus,( $(cunter).data('index')==data.caseStatus.toString()));
        return $(cunter).data('index')==data.caseStatus.toString();
    });
    console.log('updateCounterIndicator',counter);
    if(counter.length>0){
        $(counter[0]).text($.grep(this.opt.counterData,(item)=>{
            return item.id==data.id && compareStatus(item.caseStatus,data.caseStatus)
        }).length);
        $(counter[0]).show();
    }else{
        $(counter[0]).hide();
    }
}
ProgressesButton.prototype.setFlow=async function(target,duration,isSub){
    var _this=this;
    var currentPosition=_this.formatIndex();
    var targetPosition=_this.formatIndex($(target).data('main-index'));
    var preLine=$(_this.outter_frame).find("#"+target.data("preLineId"));
    var nextLine=$(_this.outter_frame).find("#"+target.data("nextLineId"));
    if(_this.breakpoint.includes(targetPosition.main-1)){
        //console.log("#"+(target.data("preLineId"))+"-"+currentPosition.sub); 
        preLine=$(_this.outter_frame).find("#"+(target.data("preLineId"))+"-"+currentPosition.sub);
    }
    //console.log(target); 
    const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));
    console.log(currentPosition.main+"-->"+targetPosition.main+"--"+isSub); 
    
    if(targetPosition.main>currentPosition.main){//增加
        
        MoveToNext();
    }else if(targetPosition.main<currentPosition.main){//减少
        MoveToPre();
    }else{
        PositionChange();
    }
    async function PositionChange(){
        var _duration=(preLine.css('display')=="none")?0:duration;
        var nextElement=$(_this.outter_frame).find(".main-indicator-index"+(targetPosition.main+1));
        if(_this.breakpoint.includes(targetPosition.main)){
            if(currentPosition.sub==targetPosition.sub){
                await $(_this.outter_frame).find(".main-indicator-index"+(targetPosition.main)).each(async function (index,subIndicator){
                    //console.log(subIndicator)
                    
                    var _preLine=$(_this.outter_frame).find("#"+$(subIndicator).data("preLineId"));
                    var _nextLine=$(_this.outter_frame).find("#"+$(subIndicator).data("nextLineId"));

                        setState($(subIndicator),false,nextElement);
                        await _preLine.animate({
                            width: 0+"px",
                              }, _duration ,function(){
                        });
                });
                if(isSub){
                    _this.opt.currentPosition=targetPosition.main-1+targetPosition.sub/10;
                }else{
                    _this.opt.currentPosition=targetPosition.main-1+currentPosition.sub/10;
                }
            }else{
                await $(_this.outter_frame).find(".main-indicator-index"+(targetPosition.main)).each(async function (index,subIndicator){
                    //console.log(subIndicator)
                    
                    var _preLine=$(_this.outter_frame).find("#"+$(subIndicator).data("preLineId"));
                    var _nextLine=$(_this.outter_frame).find("#"+$(subIndicator).data("nextLineId"));
                    if(_this.formatIndex($(subIndicator).data("main-index")).sub==targetPosition.sub){
                        if (_this.opt.deadSteps.includes($(subIndicator).text())) nextElement=null;
                        await _preLine.animate({
                            width: _preLine.data("width")+"px",
                              }, _duration ,function(){
                                setState($(subIndicator),true,nextElement);
                        });
                        
                    }else{
                        setState($(subIndicator),false,nextElement);
                        _preLine.css({"width": 0+"px",});
                    }
                });
                if(isSub){
                    _this.opt.currentPosition=targetPosition.main+targetPosition.sub/10;
                }else{
                    _this.opt.currentPosition=targetPosition.main+currentPosition.sub/10;
                }
            }
            console.log("not move: "+currentPosition.main+"."+currentPosition.sub+"-->"+_this.opt.currentPosition);
            
        }else{
            //if($(target).data("isSelected"))
            setState($(target),!$(target).data("isSelected"),nextElement);
                var _preLine=$(_this.outter_frame).find("#"+$(target).data("preLineId"));
                //console.log(_preLine);
                if(_this.breakpoint.includes(currentPosition.main-1)){
                    //console.log("breakpoint #"+(indicator.data("preLineId"))+"-"+currentPosition.sub); 
                    _preLine=$(_this.outter_frame).find("#"+(target.data("preLineId"))+"-"+currentPosition.sub);
                }
                await _preLine.animate({
                    width: 0+"px",
                      }, _duration ,function(){
                        //setState($(subIndicator),false,nextElement);
                });
                if(isSub){
                    _this.opt.currentPosition=targetPosition.main-1+targetPosition.sub/10;
                }else{
                    _this.opt.currentPosition=targetPosition.main-1+currentPosition.sub/10;
                }
                
                console.log("remove self: "+currentPosition.main+"."+currentPosition.sub+"-->"+_this.opt.currentPosition);
        }
        $(_this.outter_frame).trigger({type:'stepChanged', Position:_this.formatIndex(_this.opt.currentPosition),
                        dataId:_this.dataId});
    }
    async function MoveToNext(){
        
        for(var i=currentPosition.main;i<targetPosition.main;i++){
            
            if(preLine.length>0){
                //console.log($(preLine).data('width')); 
                var _duration=(preLine.css('display')=="none")?0:duration;
                await preLine.animate({
                    width: preLine.data("width")+"px",
                      }, _duration ,function(){
                          //console.log(i+"---"+targetPosition.sub);
                          
                          if(_this.breakpoint.includes(i)){
                              var nextElement=$(_this.outter_frame).find(".main-indicator-index"+(i+1));
                              
                              $(_this.outter_frame).find(".main-indicator-index"+(i)).each(function (index,subIndicator){
                                //console.log(subIndicator)
                                if(_this.formatIndex($(subIndicator).data("main-index")).sub==targetPosition.sub){
                                    if (_this.opt.deadSteps.includes($(subIndicator).text())) nextElement=null;
                                    setState($(subIndicator),true,nextElement);
                                }else{
                                    setState($(subIndicator),false,nextElement);
                                }
                              });
                          }else{
                            setState($(_this.outter_frame).find(".main-indicator-index"+(i)),true,$(_this.outter_frame).find(".main-indicator-index"+(i+1)));
                          }
                          
                  });
                  await delay(_duration-100);
                  
                  //console.log(indexs.main+"-->"+(i+1));
                  if(isSub){
                    _this.opt.currentPosition=i+1+targetPosition.sub/10;
                  }else{
                    _this.opt.currentPosition=i+1+currentPosition.sub/10;
                  }
                  console.log("move next: "+currentPosition.main+"."+currentPosition.sub+"-->"+_this.opt.currentPosition);
            }else{
                var nextElement=$(_this.outter_frame).find(".main-indicator-index"+(targetPosition.main+1));
                setState($(target),!$(target).data("isSelected"),nextElement);
                
            }
        }
        $(_this.outter_frame).trigger({type:'stepChanged', Position:_this.formatIndex(_this.opt.currentPosition),
                        dataId:_this.dataId});
    }
    async function MoveToPre(){
        for(var i=currentPosition.main;i>targetPosition.main;i--){
            //console.log("MoveToPre");
            var indicator=$(_this.outter_frame).find(".main-indicator-index"+(i));
            var nextElement=$(_this.outter_frame).find(".main-indicator-index"+(i+1));
            
            var _preLine=$(_this.outter_frame).find("#"+indicator.data("preLineId"));
            
            if(indicator.length>1){
                
                _preLine=$(_this.outter_frame).find("#"+indicator.filter(".sub-index-"+currentPosition.sub).data("preLineId"));
                //_preLine=$(_this.outter_frame).find("#"+indicator[currentPosition.sub].data("preLineId"));
            }
            //console.log(_preLine);
            if(_this.breakpoint.includes(i-1)){
                //console.log("breakpoint #"+(indicator.data("preLineId"))+"-"+currentPosition.sub); 
                var _nextElement=$(_this.outter_frame).find(".main-indicator-index"+(i));
                _preLine=$(_this.outter_frame).find("#"+(indicator.data("preLineId"))+"-"+currentPosition.sub);
                
            }
            //console.log(_preLine);
            //console.log(nextElement);
            if(_preLine.length>0){
                var _duration=(preLine.css('display')=="none")?0:duration;
                setState($(indicator),false,nextElement);
                await _preLine.animate({
                    width: 0+"px",}, 
                    _duration ,function(){
                        
                });
                await delay(_duration-100);
                if(_this.breakpoint.includes(i-1)){
                    $(_this.outter_frame).find(".main-indicator-index"+(i-1)).each(async function (index,subIndicator){
                        //console.log(subIndicator)
                        var __preLine=$(_this.outter_frame).find("#"+$(subIndicator).data("preLineId"));
                        if(_this.formatIndex($(subIndicator).data("main-index")).sub==targetPosition.sub && isSub){
                            if (_this.opt.deadSteps.includes($(subIndicator).text())) _nextElement=null;
                            
                            await __preLine.animate({
                                width: __preLine.data("width")+"px",
                                }, _duration ,function(){
                                    setState($(subIndicator),true,_nextElement);
                                });
                        }else{
                            setState($(subIndicator),false,_nextElement);
                            await __preLine.animate({
                                width: 0+"px",
                                }, _duration ,function(){
                                });
                        }
                        await delay(_duration-100);
                    });
                }  
                  //console.log(indexs.main+"-->"+(i+1));
                if(isSub){
                    _this.opt.currentPosition=i-1+targetPosition.sub/10;
                }else{
                    if(_this.breakpoint.length>0 && _this.breakpoint[0]>i-1){
                        _this.opt.currentPosition=i-1;
                    }else{
                        _this.opt.currentPosition=i-1+currentPosition.sub/10;
                    }
                }
                console.log("move pre: "+currentPosition.main+"."+currentPosition.sub+"-->"+_this.opt.currentPosition);
            }
        }
        $(_this.outter_frame).trigger({type:'stepChanged', Position:_this.formatIndex(_this.opt.currentPosition),
                        dataId:_this.dataId});
    }
    function setState(element,isSelected,nextElement){
        if(isSelected){
            //element.removeClass("progress-but-disable");
            element.css({"background":_this.opt.selected_color,"color":"white"});
            element.data("isSelected",true);
            if(nextElement){
                nextElement.css({"color":"rgb(51, 51, 51)",'cursor':'pointer'});
                //nextElement.addClass("progress-but-disable");
                nextElement.data("canSelect",true);
            }
        }else{
            //element.removeClass("progress-but-disable");
            element.css({"background":_this.opt.background_color,"color":"rgb(51, 51, 51)",'cursor':'pointer'});
            element.data("isSelected",false);
            if(nextElement){
                //if(!_this.opt.isViewMode) {
                    nextElement.css({"color":"gray",'cursor':'default'});
                    //$(nextElement).addClass("progress-but-disable");
                //}
                nextElement.data("canSelect",false);
            }
        }
    }
}
ProgressesButton.prototype.formatIndex=function(position){
    if(position==null) position=Number(this.opt.currentPosition);
        var main=Math.floor(position);
        var sub=Math.round((position-main)*10);
        return {main:main,sub:sub};
}
ProgressesButton.prototype.switchSubStepVisibility=function(args){
    args["showSubSteps"]=!this.opt.showSubSteps;
    //console.log(args.showSubSteps);
    this.init(args);
}
ProgressesButton.prototype.refresh=function(args){
    //args["showSubSteps"]=!this.opt.showSubSteps;
    //console.log(args.showSubSteps);
    this.init(args);
}
ProgressesButton.prototype.getItem=function(position){
    var items=$(this.outter_frame).find(".main-indicator-index"+position.main).filter(function(index,item){
        return Number($(item).data('main-index'))==position.main+position.sub/10;
    });
    if(items.length>0) return items[0];
    return undefined;
}
ProgressesButton.prototype.setStep=async function(target){
    await this.setFlow($(target),this.opt.duration,!$(target).data('isMainIndicator'));
}
ProgressesButton.prototype.switchReadyOnly= function(){
    this.opt.readOnly=!this.opt.readOnly
    this.items.forEach((ele)=>{
        var posisiton=this.formatIndex($(ele).data('main-index'));
        console.log(posisiton);
        this.setState(ele,posisiton.main,$(ele).data('isMainIndicator')?-1:posisiton.sub);
    });
}
ProgressesButton.prototype.isSelectable= function(mainIndex,subIndex){
    var main=Math.floor(this.opt.currentPosition);
        var sub=Math.round((this.opt.currentPosition-main)*10);
        if(subIndex>-1){
            return main>=mainIndex && sub==subIndex;
        }
        return main>=mainIndex;
}
ProgressesButton.prototype.isSelected= function(mainIndex,subIndex){
    var main=Math.floor(this.opt.currentPosition);
        //console.log(mainIndex+":"+subIndex+"==");
        if(subIndex>-1){
            var sub=Math.round((this.opt.currentPosition-main)*10);
            return main>=mainIndex && sub==subIndex;
        }else{
            return main>=mainIndex;
        }
}

ProgressesButton.prototype.setState=function(element,mainIndex,subIndex){
    element.data("canSelect",true);
    element.data("isSelected",false);
    if(this.isSelected(mainIndex,subIndex)){
        
            
            element.css({"background":this.opt.selected_color,"color":"white"});
            
            element.data("isSelected",true);

        
        
    }else{
        if(this.isSelected(mainIndex-1,-1)==false){
            //if(!_this.opt.isViewMode) {
                element.css({"color":"gray","cursor":"default"});
                
                //element.addClass("progress-but-disable");
            //}
            element.data("canSelect",false);
            
        }else{
            if(!this.opt.readOnly){
                element.css({"background":this.opt.background_color,"color":"rgb(51, 51, 51)",'cursor':'pointer'});
                //element.data("canSelect",true);
            }
        }
        if(this.opt.readOnly){
            element.css({"color":"gray","cursor":"default"});
            element.data("canSelect",false);
        }
    }
}
