
function extend(opt1,opt2){
    for(var attr in opt2){
        //console.log(attr+": "+opt1[attr]+"-->"+opt2[attr]);
        opt1[attr] = opt2[attr];
    }
}

function compareStatus(source,target){
    var _source=formatIndex(source);
    var _target=formatIndex(target);
    return _source.main==_target.main && _source.sub==_target.sub;
}
function getStatusLabel(status,template){
    console.log('getStatusLabel',status,template)
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
const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));
function formatIndex(position){
    var main=Math.floor(position);
    var sub=Math.round((position-main)*10);
    return {main:main,sub:sub};
}
function ProgressesButton(arg){
    this.body=document.body;
    this.opt = {
        normal_color : "lightgray",
        actived_color:"#1362B7",
        currentPosition:0,
        currentSubPosition:0,
        width:440,
        steps:[],
        deadSteps:[],
        size:10,//节点半径大小
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
        eventsData:[],
    }
    this.init(arg)
}
ProgressesButton.prototype.init=function(arg){
    //console.log("init.............."+this.opt.labelPosition);
    
  console.log('初始变量');
    var _this=this;
    extend(this.opt,arg);
    console.log('当前位置',this.opt.currentPosition)
    if (_this.opt.containerId!=undefined) this.parent=$(_this.opt.containerId);
    var steps=_this.opt.steps;//节点数据
    var countersize=_this.opt.size*2*0.4;
    var counterOffset=countersize/3;
    
    //["立案","一审","二审",{name:"执行中",data:["强制执行","正常执行","无需执行"]},"结案","再审","监督"]

    this.breakpoint=[];//分支点
    this.items=[];
  //建立容器
  console.log('建立容器');
    if(this.instance==null){
        this.instance=$('<div class="ProgressesButton-container"></div>');
        this.instance.css({
            'width':_this.opt.width+(_this.opt.hasShadow?+"4":0)+'px',
            position: 'relative',
        });
    }else{
        this.instance.empty();
    }


    
  console.log('设定初始位置');

    var v_dist=_this.opt.size*1.5;//节点垂直间隔
    var step=parseInt((_this.opt.width-_this.opt.size*2)/(steps.length-1));//根据宽度判断每个节点距离-节点横向间隔
    this.step=step;

    var h_dist=parseInt((_this.opt.width-(_this.opt.size)*2)/(steps.length-1));//根据宽度判断每个节点距离-节点横向间隔

    var tops=[];
    var lefts=[]

    var v_gap=Number.isNaN(_this.opt.verticalGap)?(step-_this.opt.size*2):_this.opt.verticalGap;//节点垂直间隔

    var v_dist=_this.opt.size*2+v_gap;
    
    //["立案","一审","二审",{label:"正在执行",data:["强制执行","正常执行","无需执行"]},"结案","再审"]; 

    
    var points=[];
    _this.opt.steps.forEach(function(stepPointName,index){
        //if(index==0) offset=0;
        
        lefts.push(h_dist*(index)+_this.opt.size);
        
        
        if(stepPointName instanceof Object){
            var breakpointData={'id':index,'name':stepPointName.name,'sub':[],'isMain':true};
            _this.breakpoint=index;
            _this.opt.breakpoint=index;
            if(stepPointName.hasOwnProperty('data')){
                if(stepPointName.data instanceof Array){
                    stepPointName.data.forEach(function(subStepPointName,subIndex){
                        breakpointData.sub.push({'id':subIndex,'name':subStepPointName,'isMain':false});
                        //var prev_top=tops[tops.length-1];
                        tops.push(_this.opt.size+v_dist*subIndex+(_this.opt.showCounter?counterOffset:0));
                    });
                }
            }
            points.push(breakpointData);
        }else{
            points.push({'id':index,'name':stepPointName,'isMain':true});
        }
    }); 
    var m_line=_this.opt.showSubSteps?(tops[tops.length-1]+(_this.opt.size))/2:_this.opt.size;  
    console.log("tops",tops);
    console.log('lefts',lefts);
    
    console.log('middle line',m_line);


    this.instance.css({height:(_this.opt.showSubSteps?tops[tops.length-1]+(_this.opt.size):_this.opt.size*2)+(_this.opt.hasShadow?+"4":0)})
    var NextCombineLines=[];
    _this.pointMap={};
    points.forEach(function(stepPoint,index){
        var lines=[];
        var point=setStepPoint(stepPoint.name,lefts[index],m_line,index,stepPoint.isMain);
        if(index>0)lines=setStepLine(lefts[index],m_line,index,stepPoint.isMain,h_dist);
        if(index==0) point.addClass('stepPoint-selectable');
        if(lines.length>0)lines[1].jqmData('stepoint',point);
        if(point!=undefined){
            point.on('click',clickedEvent);
            point.jqmData('stepoint',lines[1]);
            _this.pointMap[index]={
                self:point,
                isMain:true,
                left:lefts[index],
                top:m_line,
                line:lines[1]==undefined?[]:[lines[1]],
                isSelectable:index<=_this.opt.currentPosition+1,
                isActived:index<=_this.opt.currentPosition,
            }
            if(index<points.length-1){
                var subPoints=[];
                if(points[index+1].hasOwnProperty('sub')){
                    
                    points[index+1].sub.forEach((subStepPoint,subIndex)=>{
                        subPoints.push((index+1)+subIndex/10);
                    })
                    
                }else{
                    subPoints.push(index+1);
                }
                _this.pointMap[index]['nextPointIndex']=subPoints;
                point.jqmData('nextPoint',subPoints);
            }
            if(index>0){
                var subPoints=[];
                if(points[index-1].hasOwnProperty('sub')){
                    
                    points[index-1].sub.forEach((subStepPoint,subIndex)=>{
                        subPoints.push((index-1)+subIndex/10);
                    })
                    
                }else{
                    subPoints.push(index-1);
                }
                _this.pointMap[index]['prevPointIndex']=subPoints;
                point.jqmData('prevPoint',subPoints);
            }
        }
        if(NextCombineLines.length>0){
            if(lines.length>0){
                lines[0].hide();
                lines[1].hide();
            }
            NextCombineLines.forEach(line=>{
                $(line).jqmData('stepoint',point);
            })
            $(point).jqmData('stepoint',NextCombineLines);
            _this.pointMap[index]['line']=NextCombineLines;
            //console.log("stepoint--",$(point),$(point).jqmData('stepoint'));
            NextCombineLines=[];
        }
        
        if(stepPoint.hasOwnProperty('sub')){
            if(_this.opt.showSubSteps){
                point.hide();
                if(lines.length>0){
                    lines[0].hide();
                    lines[1].hide();
                }
                stepPoint.sub.forEach((subStepPoint,subIndex)=>{
                    var p_index=Math.round(Math.abs(m_line-(tops[subIndex]-_this.opt.line_size/2))/v_dist);
                    var height=v_dist*p_index;
                    var long_edge=Math.sqrt(height**2+h_dist**2);
                    var angle=-parseInt(bevel(height,long_edge));
                    if((tops[subIndex])>m_line) angle=angle*-1;
                    var subLines=setStepLine(lefts[index],m_line-_this.opt.line_size,index+subIndex/10,subStepPoint.isMain,long_edge,angle);//开始线
                    var subPoint=setStepPoint(subStepPoint.name,lefts[index],tops[subIndex],index+subIndex/10,subStepPoint.isMain);
                    subPoint.on('click',clickedEvent);
                    subLines[1].jqmData('stepoint',subPoint);
                    subPoint.jqmData('stepoint',subLines[1]);
                    _this.pointMap[index+subIndex/10]={
                        self:subPoint,
                        isMain:false,
                        left:lefts[index],
                        top:tops[subIndex],
                        line:[subLines[1]],
                        isSelectable:index<=formatIndex(_this.opt.currentPosition+1).main,
                        isActived:index==formatIndex(_this.opt.currentPosition).main&&subIndex==formatIndex(_this.opt.currentPosition).sub||index<formatIndex(_this.opt.currentPosition).main,
                    }
                    if(index<points.length-1){
                        var subPoints=[];
                        if(points[index+1].hasOwnProperty('sub')){
                            
                            points[index+1].sub.forEach((subStepPoint,subIndex)=>{
                                subPoints.push((index+1)+subIndex/10);
                            })
                            
                        }else{
                            subPoints.push(index+1);
                        }
                        subPoint.jqmData('nextPoint',subPoints);
                        _this.pointMap[index+subIndex/10]['nextPointIndex']=subPoints;
                    }
                    angle=-parseInt(bevel(h_dist,long_edge)-90);
                    if((tops[subIndex])>m_line) angle=angle*-1;
                    if(!_this.opt.deadSteps.includes(subStepPoint.name)) {
                        
                        NextCombineLines.push(setStepLine(lefts[index+1],tops[subIndex]-_this.opt.line_size,index+subIndex/10,false,long_edge,angle)[1]);//结束线
                    }else{
                        _this.pointMap[index+subIndex/10]['nextPointIndex']=[];
                    }
                    
                    if(index>0){
                        var subPoints=[];
                        if(points[index-1].hasOwnProperty('sub')){
                            
                            points[index-1].sub.forEach((subStepPoint,subIndex)=>{
                                subPoints.push((index-1)+subIndex/10);
                            })
                            
                        }else{
                            subPoints.push(index-1);
                        }
                        _this.pointMap[index]['prevPointIndex']=subPoints;
                        subPoint.jqmData('prevPoint',subPoints);
                    }
                });
            }
            
            
        
        }
        //if(lines.length>0)console.log(lines[1].jqmData('stepoint'));
    });
    _this.parent.append(_this.instance);
    _this.parent.trigger('create');
    console.log('map',_this.pointMap);
    console.log('currentPosition',_this.opt.currentPosition);
    var positionTo=_this.opt.currentPosition;
    _this.opt.currentPosition=0;
    _this.MoveTo(positionTo,0);
    if(_this.opt.eventsData.length>0){
        _this.setEvent(_this.opt.eventsData);
    }
    //var middle_line=(tops[tops.length-2]+top_offset)/2

    function setStepLine(left,top,index,isMain,width,angle){
        
        var angleCss={};
        if(angle!=undefined){
            angleCss={'transform':"rotate("+(angle)+"deg)",
            "transform-origin": "left center"}
        }
        var lineCss=Object.assign({
            left:left-h_dist,
            top:top,
            width:width,
            height:_this.opt.line_size*2,
        },angleCss)
        var subClass=isMain?"":" subPoint";
        var bkLine=$('<div class="stepLine'+subClass+'" data-index='+index+'></div>');
        bkLine.css(lineCss);
        _this.instance.append(bkLine);
        var fgLine=$('<div class="foregroundStepLine'+subClass+'" data-index='+index+' data-width="'+width+'"></div>');
        lineCss=Object.assign({
            left:left-h_dist,
            top:top,
            width:0+"px",
            height:_this.opt.line_size*2,
            'background-color':_this.opt.actived_color
        },angleCss)
        fgLine.css(lineCss);
        _this.instance.append(fgLine);
        return [bkLine,fgLine];
    }
    function setStepPoint(label,left,top,index,isMain){
        if(_this.opt.labelPosition!="bottom") var _label=$('<span>'+label+'</span>');
        else _label=$('<span>'+label.substring(0,1)+'</span>');
        var indicatorBackground=$('<div class="counter-indicator" data-index='+index+'></div>');
        var subClass=isMain?"":" subPoint";
        var point=$('<div class="stepPoint'+subClass+'" data-index='+index+'></div>');
        var _top="calc(100% + 10px)";
        if(_this.opt.labelPosition=="center") _top="50%";
        if(_this.opt.labelPosition!="bottom") _label.css({width:_this.opt.size*2-30,top:_top});
        else _label.css({top:_top});
        if(_this.opt.readOnly) _label.css({color:'#333'});
        point.append(_label);
        point.append(indicatorBackground);
        point.css({
            left:left,
            top:top,
            width:_this.opt.size*2-_this.opt.line_size*2,
            height:_this.opt.size*2-_this.opt.line_size*2,
            'border-width': _this.opt.line_size+"px",
            borderRadius:(_this.opt.size)+"px",
            fontSize:_this.opt.fontSize,
        });
        indicatorBackground.css({
            right:-counterOffset,
            top:-counterOffset,
            width:countersize,
            height:countersize,
            "line-height":countersize+"px",
            "fontSize":_this.opt.fontSize*0.9+'px',
            "fontWeight":700,
            "borderRadius":(countersize*0.5)+"px",

        });
        if(_this.opt.hasShadow) point.css({
            filter: 'drop-shadow(0 0.2rem 0.25rem rgba(0, 0, 0, 0.5))'})
        indicatorBackground.hide();
        setCounterNumber(indicatorBackground,_this.opt.counterData,index);
        _this.instance.append(point);
        return point;
    }
    async function clickedEvent(e){
        if($(this).hasClass('stepPoint-selectable') || $(this).hasClass('setpPoint-actived')){
            console.log(this);
            $(_this.instance).trigger({type:'itemOnClicked', Position:formatIndex($(e.currentTarget).data('index')),
                            dataId:_this.dataId, target:$(e.currentTarget),event:e});
            
            //_this.setPointState($(this).data('index'),true);
        }
    }
    function setCounterNumber(counterElement,data,index){
        //var _index=formatIndex(index);
        if(data.length>0){
            
            var _counter=data.filter(value=>{ 
                var sourceIndex=formatIndex(value.caseStatus);
                //console.log(index,value.caseStatus,sourceIndex.main>_this.breakpoint,(sourceIndex.main>_this.breakpoint?sourceIndex.main:value.caseStatus==index));
                return (sourceIndex.main>_this.breakpoint?sourceIndex.main:value.caseStatus)==index
            });
            console.log('setCounterIndecator',_counter.length,index,_counter);
            if(_counter.length>0){
                $(counterElement).text(_counter.length);
                if(_this.opt.showCounter){
                    $(counterElement).show();
                    //$(counterElement).data('index',(index+(sub==undefined?0:sub)/10));
                    //_this.outter_frame.append(counter)
                }
                
            }
        }
    }
    function bevel(straight,oblique){
        const sinOfAngleX = straight / oblique;
        return Math.round((Math.asin(sinOfAngleX)*180)/Math.PI);
    }
}
ProgressesButton.prototype.updateCounterIndicator=function(data){
    
    //console.log('updateCounterIndicator',this.instance.find('.counter-indicator'));
    var counter=$.grep(this.instance.find('.counter-indicator'),(cunter)=>{
        console.log('updateCounterIndicator', $(cunter).data('index'),data.caseStatus,( $(cunter).data('index')==data.caseStatus.toString()));
        return $(cunter).data('index')==data.caseStatus.toString();
    });
    //console.log('updateCounterIndicator',counter);
    if(counter.length>0){
        $(counter[0]).text($.grep(this.opt.counterData,(item)=>{
            return item.id==data.id && compareStatus(item.caseStatus,data.caseStatus)
        }).length);
        $(counter[0]).show();
    }else{
        $(counter[0]).hide();
    }
}
ProgressesButton.prototype.MoveTo=async function(index,duration){
    var _this=this;
    if (duration==undefined) duration=500;
    console.log('MoveTo',index);
    if(index==-1){
        //var target=_this.getPointByIndex(0);
        await _this.setPointState(0,false,duration);
        //_this.setPointState(0,false);
    }else{
        
        //var target=_this.getPointByIndex(index);
        await _this.setPointState(index,false,duration);
    }
    
}
ProgressesButton.prototype.getPointByIndex=function(index){//这里牵扯到分离点，就这个案例只有一个，如果有多个可能需要改进
    var _this=this;
    if(index==-1) index=0;
    console.log(index,_this.pointMap);
    if(index>=_this.breakpoint+1||index<_this.breakpoint) index=formatIndex(index).main;
    else{
        index=formatIndex(index).main+(_this.opt.showSubSteps?formatIndex(index).sub/10:0);
    }
    
    if(_this.pointMap.hasOwnProperty(index))
        return _this.pointMap[index].self;
    else{
        console.log("无法找到对应数据",index,_this.pointMap);
        return undefined;
    }
        
}
ProgressesButton.prototype.getPointMapData=function(index){//这里牵扯到分离点，就这个案例只有一个，如果有多个可能需要改进
    var _this=this;
    if(index==-1) index=0;
    //console.log(index,_this.pointMap);
    if(index>=_this.breakpoint+1) index=formatIndex(index).main;
    else{
        index=formatIndex(index).main+(_this.opt.showSubSteps?formatIndex(index).sub/10:0);
    }
    //console.log(index,_this.pointMap);
    return _this.pointMap[index];
}
ProgressesButton.prototype.setEvent=function(data,positionTemplate){
    var _this=this;
    var isShift=false;
    $('.event-lead-line').remove();
    $('.event-box').remove();
    if(positionTemplate==undefined) positionTemplate={
        0:{height:80,position:"bottom"},1:{height:100,isTop:true},2:{height:100}
    }
    //console.log('setEvent',data);
    data.forEach(d=>{
        var pointData=_this.getPointMapData(d.caseStatus);
        var eventBox=$('.event-box[data-index='+d.caseStatus+']');
        if(eventBox.length>0) {
            eventBox=eventBox[0];
        }
        else {
            var left=pointData.left;
            var line_top=pointData.top-(positionTemplate[d.caseStatus].isTop?positionTemplate[d.caseStatus].height:0);
            var box_top=pointData.top-(positionTemplate[d.caseStatus].isTop?positionTemplate[d.caseStatus].height:0)+(positionTemplate[d.caseStatus].isTop?0:positionTemplate[d.caseStatus].height-20);
            var box_transform={transform:'translate(-50%,-100%)'}
            if(positionTemplate[d.caseStatus].position=="top"){
                line_top=pointData.top-positionTemplate[d.caseStatus].height;
                box_transform={transform:'translate(-50%,-100%)'};
            }else if(positionTemplate[d.caseStatus].position=="bottom"){
                box_transform={transform:'translate(-50%,0%)'};
            }else if(positionTemplate[d.caseStatus].position=="left"){
                box_transform={transform:'translate(0%,-100%)'};
            }else if(positionTemplate[d.caseStatus].position=="right"){
                box_transform={transform:'translate(0%,0%)'};
            }
            var lead_line=$('<div class="event-lead-line"></div>');
            lead_line.css({
                left:pointData.left,
                top:pointData.top-(positionTemplate[d.caseStatus].isTop?positionTemplate[d.caseStatus].height:0),
                height:positionTemplate[d.caseStatus].height+'px'

            })
            eventBox=$('<ul data-role="listview" data-inset="true" data-index='+d.caseStatus+' class="event-box"></div>');
            if (pointData!=undefined){
                $(eventBox).css({
                    left:pointData.left,
                    top:pointData.top-(positionTemplate[d.caseStatus].isTop?positionTemplate[d.caseStatus].height:0)+(positionTemplate[d.caseStatus].isTop?0:positionTemplate[d.caseStatus].height-20),

                })
            }
            
            _this.instance.append(lead_line);
            _this.instance.append(eventBox);
            if(positionTemplate[d.caseStatus].isTop){
                $(eventBox).css({
                    
                    transform:'translate(-50%,-100%)'
                })
            }
        }
        
        if (pointData!=undefined){
            console.log('setEvent',pointData);
            
            
            
            var eventItem=$('<li><a href="#">'+d.caseNo+'</a></li>')
            $(eventBox).append(eventItem);
            
            /*
            $(eventBox).on('mouseover',function(e){
                $(this).addClass('evnet-box-shadow');
            })
            $(eventBox).on('mouseout',function(e){
                $(this).removeClass('evnet-box-shadow');
            })
            */
            
           // console.log('setEvent',lead_line)
        }
        $(eventBox).listview().listview('refresh');
        $(eventBox).trigger('create');
        
        console.log("判断是否超出范围",(pointData.left-$(eventBox).width()/2),_this.instance.position().left);
        if(pointData.left-$(eventBox).width()/2<_this.instance.position().left) $(eventBox).css({
            left:$(eventBox).width()/2,

        })
        console.log('width',$(eventBox).width());
    })
    _this.instance.trigger('create');
    //console.log('setEvent',_this.instance.html())
};
ProgressesButton.prototype.setPointState=async function(index,isClicked,duration){
    var _this=this;
    
    function activePoint(point,nextPointIndexs){
        if(_this.opt.labelPosition!="bottom")  $(point).addClass('setpPoint-actived-white');
        else $(point).addClass('setpPoint-actived');
        
        if(nextPointIndexs!=undefined && nextPointIndexs.length>0){
            nextPointIndexs.forEach(idx=>{
                
                
                $('.stepPoint[data-index="'+idx+'"]').addClass('stepPoint-selectable');
            })
        }
        var pointPosition=formatIndex($(point).data('index'));
        var currentPosition=formatIndex(_this.opt.currentPosition);
        //console.log('currentPosition active b',_this.opt.currentPosition,currentPosition,pointPosition,$(point).data('index'));
        if(pointPosition.main<=_this.breakpoint)
            _this.opt.currentPosition=$(point).data('index');
        else
            _this.opt.currentPosition=pointPosition.main+currentPosition.sub/10;
        //console.log('currentPosition active a',_this.opt.currentPosition,currentPosition,pointPosition);
      
    }
    
    function deactivePoint(point,nextPointIndexs){
        $(point).removeClass('setpPoint-actived').removeClass('setpPoint-actived-white');
        if(nextPointIndexs!=undefined && nextPointIndexs.length>0){
            nextPointIndexs.forEach(idx=>{
                $('.stepPoint[data-index="'+idx+'"]').removeClass('stepPoint-selectable');
            });
        }
        
        
        var pointPosition=formatIndex($(point).data('index'));
        var currentPosition=formatIndex(_this.opt.currentPosition);
        //console.log('currentPosition deactive b',currentPosition,pointPosition);
        if(pointPosition.main<_this.breakpoint)
            _this.opt.currentPosition=pointPosition.main-1;
        else
            _this.opt.currentPosition=pointPosition.main-1+currentPosition.sub/10;
        //console.log('currentPosition deactive a',_this.opt.currentPosition);
      
    }
    function isSameMainIndex(index){
        return formatIndex(_this.opt.currentPosition).main==formatIndex(index).main;
    }
    
    console.log('目标节点',index,'当前节点',_this.opt.currentPosition);
    //nextPointIndex 下一个的编号 array[int]
    //prevPointIndex 前一个的编号 array[int]
    //self 自己元素 object
    //line 相关联的线 array[object]
    //var clickedIndex=$(point).data('index');


    var targetPointData=_this.getPointMapData(index);
    var targetPoint=_this.getPointByIndex(index);
    var targetPosition=formatIndex(index);

    var currentPointData=_this.getPointMapData(_this.opt.currentPosition);
    var currentPoint=_this.getPointByIndex(_this.opt.currentPosition);
    var currentPosition=formatIndex(_this.opt.currentPosition);
    //递减：以目标sub为准，但目标index小于breakpoint，则先以现目标为准，直到过了breakpoint
    //还有一个可能是目标index在breakpoint上，但不是同一个子元素路径，则先要回到breakpoint前一个，在增加到目标位置
    if(targetPosition.main<currentPosition.main){
        console.log('目标小于当前，递减')
        if(targetPosition.main>=_this.breakpoint && currentPosition.main>=_this.breakpoint && targetPosition.sub!=currentPosition.sub && !isClicked){
            console.log('目标和当前都大于breakpoint，并且子不一样',targetPosition)
            await _this.setPointState(_this.breakpoint-1+currentPosition.sub/10,true);
            await _this.setPointState(targetPosition.main+targetPosition.sub/10,true);
        }else{
            var offset=0;
            if(targetPosition.main==_this.breakpoint){
                offset=-1;
            }
            for(var i=currentPosition.main;i>targetPosition.main+offset;i--){
                var subIndex=targetPosition.sub;
                if(targetPosition.main<=_this.breakpoint) subIndex=currentPosition.sub;
                if(i<_this.breakpoint) subIndex=0;
                var _index=i+subIndex/10;
                var point=_this.getPointByIndex(_index);
                var pointData=_this.getPointMapData(_index);

                deactivePoint(point,pointData.nextPointIndex)
                //更改当前节点相关路线状态
                if(pointData.line.length==1){//正常节点只有一条路线
                    var line=pointData.line[0];
                    await $(line).animate({
                            width: 0+"px",
                    }, duration , function(){});
                }else if(pointData.line.length==2){//交汇节点有多条，需要按原index的subIndex来判断走哪条路线
                    var line=$.grep(pointData.line,(ln)=>{return $(ln).data('index')==i-1+subIndex/10;});
                    //console.log(line);
                    if(line.length>0){
                        line=line[0];
                        await $(line).animate({
                            width: 0+"px",
                        }, duration ,function(){})
                    }
                }
                await delay(duration-100);
            }
            if(targetPosition.main==_this.breakpoint){
                if(targetPointData.line.length==1){
                    var line=targetPointData.line[0];
                    await $(line).animate({
                        width: $(line).data('width')+"px",
                        }, duration ,function(){})
                }else if(targetPointData.line.length==2){
                    var line=$.grep(targetPointData.line,(ln)=>{return $(ln).data('index')==index;});
                    if(line.length>0){
                        line=line[0];
                        await $(line).animate({
                        width: $(line).data('width')+"px",
                            }, duration ,function(){})
                    }
                }
                await delay(duration-100);
                activePoint(targetPoint,targetPointData.nextPointIndex);
            }
        }
    }else if(targetPosition.main==currentPosition.main){//同级或自己
        console.log('目标和当前等同',targetPosition)
        //var currentPoint=_this.getPointByIndex(_this.opt.currentPosition);
        if(targetPosition.main!=_this.breakpoint){
            if(currentPosition.main>_this.breakpoint){
                console.log('目标和当前等同,但大于breakpoint',targetPosition)
                await _this.setPointState(_this.breakpoint-1+currentPosition.sub/10,true);
                await _this.setPointState(targetPosition.main+targetPosition.sub/10,true);
            }else{
                if($(targetPoint).hasClass('setpPoint-actived')){
                    deactivePoint(targetPoint,targetPointData.nextPointIndex)
                    if(targetPointData.line.length==1){
                        var line=targetPointData.line[0];
                        await $(line).animate({
                            width: 0+"px",
                            }, duration ,function(){
                            })
                    }
                }else{
                    if(targetPointData.line.length==1){
                        var line=targetPointData.line[0];
                        await $(line).animate({
                            width: $(line).data('width')+"px",
                            }, duration ,function(){})
                        await delay(duration-100);
                        
                    }
                    activePoint(targetPoint,targetPointData.nextPointIndex)
                }
            }
        }else{
            deactivePoint(currentPoint,currentPointData.nextPointIndex)
            if(currentPointData.line.length==1){//正常节点只有一条路线
                var line=currentPointData.line[0];
                await $(line).animate({
                        width: 0+"px",
                }, duration , function(){});
            }else if(currentPointData.line.length==2){//交汇节点有多条，需要按原index的subIndex来判断走哪条路线
                var line=$.grep(currentPointData.line,(ln)=>{return $(ln).data('index')==currentPointData.main-1+currentPointData.sub/10;});
                //console.log(line);
                if(line.length>0){
                    line=line[0];
                    await $(line).animate({
                        width: 0+"px",
                    }, duration ,function(){})
                }
            }
            await delay(duration-100);
            if(targetPointData.line.length==1){
                var line=targetPointData.line[0];
                await $(line).animate({
                    width: $(line).data('width')+"px",
                    }, duration ,function(){})
            }else if(targetPointData.line.length==2){
                var line=$.grep(targetPointData.line,(ln)=>{return $(ln).data('index')==index;});
                if(line.length>0){
                    line=line[0];
                    await $(line).animate({
                    width: $(line).data('width')+"px",
                        }, duration ,function(){})
                }
            }
            await delay(duration-100);
            activePoint(targetPoint,targetPointData.nextPointIndex);
        }
        
    }else{//递增
        console.log('递增',currentPosition,targetPosition)
        if(targetPosition.main>=_this.breakpoint && currentPosition.main>=_this.breakpoint && targetPosition.sub!=currentPosition.sub && !isClicked){
            console.log('目标和当前都大于等于breakpoint，并且子不一样',targetPosition)
            await _this.setPointState(_this.breakpoint-1+currentPosition.sub/10,true);
            await _this.setPointState(targetPosition.main+targetPosition.sub/10,true);
        }else{
            var offset=0;
            if(currentPosition.main==0) {
                activePoint(currentPoint,currentPointData.nextPointIndex)
            }
            //if(targetPosition.main>_this.breakpoint) offset=1;
            //if( currentPosition.main==_this.breakpoint )
            for(var i=currentPosition.main+1;i<=targetPosition.main;i++){
                
                var subIndex=targetPosition.sub;
                if(i<_this.breakpoint) subIndex=0;
                var main=i;
                if(i>=_this.breakpoint && currentPosition.main>=_this.breakpoint) {//如果循环目标和原目标大于等于breakpoint
                    console.log('循环目标和原目标大于等于breakpoint');
                    subIndex=currentPosition.sub;
                    
                }
                var _index=main+subIndex/10;
                var point=_this.getPointByIndex(_index);
                var pointData=_this.getPointMapData(_index);
                console.log('递增',_index)
                
                //更改当前节点相关路线状态
                if(pointData.line.length==1){//正常节点只有一条路线
                    var line=pointData.line[0];
                    await $(line).animate({
                            width: $(line).data('width')+"px",
                    }, duration , function(){});
                }else if(pointData.line.length==2){//交汇节点有多条，需要按原index的subIndex来判断走哪条路线
                    var line=$.grep(pointData.line,(ln)=>{return $(ln).data('index')==main-1+subIndex/10;});
                    //console.log(line);
                    if(line.length>0){
                        line=line[0];
                        await $(line).animate({
                            width: $(line).data('width')+"px",
                        }, duration ,function(){})
                    }
                }
                await delay(duration-100);
                activePoint(point,pointData.nextPointIndex)
            }
        }
        
    }
}
