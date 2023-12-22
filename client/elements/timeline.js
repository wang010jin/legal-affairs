
var _cricles=[];

//#region 画图板点击事件
class pathEvent{
    constructor (x,y,type,ctx) {
        this.x = x;
        this.y=y;
        this.type=type;
        this.ctx=ctx;
    }
}
var eventManager=new function(){
    this._targets={},
    this._listeners={},
    this.setCanvas=function(canvas){
        _self=this;
        this.canvas=canvas;
        this.canvas.addEventListener("mousemove", function (event) {
            if (_self._targets.hasOwnProperty("mousemove")) {
                _self._targets["mousemove"].forEach((path)=>{
                    if(path.hasListener("mousemove")){
                        path.fire("mousemove",new pathEvent(event.offsetX, event.offsetY,"mousemove",path.ctx));
                    }
                });
            }
            if (_self._targets.hasOwnProperty("mouseover")) {
                _self._targets["mouseover"].forEach((path)=>{
                    //console.log(_self.hasListener(path,"mouseover"));
                    if (!path.inBounds){
                        //dpath.inBounds=true;
                        if (path.hasListener("mouseover")){
                                path.fire("mouseover",new pathEvent(event.offsetX, event.offsetY,"mouseover",path.ctx));
                            }
                    }
                    
                });
            }

            if (_self._targets.hasOwnProperty("mouseout")) {
                _self._targets["mouseout"].forEach((path)=>{
                    if (path.inBounds){
                        //path.inBounds=false;
                        if (path.hasListener("mouseout")){
                                path.fire("mouseout",new pathEvent(event.offsetX, event.offsetY,"mouseout",path.ctx));
                            }
                    }
                });
            }
        }, false);
        this.canvas.addEventListener("click", function (event) {
            
            _self._targets["click"].forEach((path)=>{
                path.fire("click",new pathEvent(event.offsetX, event.offsetY,"click",path.ctx))
            });
        }, false);
    }
    this.addTarget=function(target,ctx,data){
        target.sourceData=data;
        target.ctx=ctx;
        //console.log(target);
        if(!Object.keys(Object.getPrototypeOf(target)).includes('addListener')){
            var _self=this;
            Object.getPrototypeOf(target).addListener=function(type,listener){
                if (!_self._targets.hasOwnProperty(type)) {
                    _self._targets[type] = [];
                }
                if(!_self._targets[type].includes(this)){
                    //this.id=Math.floor(Date.now() / 1000);
                    _self._targets[type].push(this);
                }
                //console.log(_self._targets[type].indexOf(this));
                var targetIndex=_self._targets[type].indexOf(this);
                if (!_self._listeners.hasOwnProperty(type)) {
                    _self._listeners[type] = [];
                }
                _self._listeners[type][targetIndex]=listener;
                if (!this.hasOwnProperty("listeners")) {
                    this.listeners=[];
                }
                this.listeners.push(type);
            }
            Object.getPrototypeOf(target).hasListener=function(type){
                return this.listeners.includes(type);
            }
        }
        if(!Object.keys(Object.getPrototypeOf(target)).includes('fire')){
            Object.getPrototypeOf(target).fire=function(type,event){
                var targetIndex=_self._targets[type].indexOf(this);
                
                if(event.ctx.isPointInPath(this, event.x, event.y)){
                    if(type=="click"){
                        if (_self._listeners.hasOwnProperty(type))
                            _self._listeners[type][targetIndex].call(this,event);
                    }else{
                        if (!this.inBounds){
                            this.inBounds=true;
                            if (_self._listeners.hasOwnProperty(type))
                                _self._listeners[type][targetIndex].call(this,event);
                        }
                    }
                    
                }else{
                    if (this.inBounds){
                        this.inBounds =false;
                        if (_self._listeners.hasOwnProperty("mouseout"))
                            _self._listeners["mouseout"][targetIndex].call(this,event);
                    }
                    
                }
                
            }
        }
    }
    this.addListener=function(type,listener){
        if (!this._listeners.hasOwnProperty(type)) {
            this._listeners[type] = [];
        }
        this._listeners[type].push(listener);
        this._targets[type].push(listener);
    }
}
//#endregion

//#region 画节点图
var width=800;
var stopsGap=80;
var line2SpotDist=35;
var textPosition=[];
var datePosition=[];
var listPosition=[];
var colors=["#5E9B9F","#D66755","#E25C62","#4B9DCB","#43607A","#7C7594","#C76B8C","#65875D"];

function drawTimeline(_data,ctx,dataList){
    var from={x:width/2,y:20};
    var to={x:width/2,y:20+60};
    var currentPos=drawLine(from,to,ctx,colors[0],16);
    var isOppsite=true;
    _data.template.forEach((label,index)=>{
        currentPos=drawOneStop({x:width/2,y:currentPos+line2SpotDist},ctx,colors[index+1],16,isOppsite=!isOppsite,{label:label,index:index});
    });
    isOppsite=true;
    _data.template.forEach((label,index)=>{
        drawIndicatorText(textPosition[index],{label:label,index:index},ctx,"white");
        //dataList=[];
        //console.log('dataList',index,label,dataList);
        var data=dataList.filter(item=>{ return item.id==index});
        $.each(dataList,(idx,itm)=>{
            data=itm.filter(item=>{ return item.id==index});
        })
        //console.log('dataList',index,label,data);
        if(data.length>0){
            var val=data[0].label;
            if(data[0].date!=undefined){
                if(data[0].date=="0000-00-00 00:00:00")
                    val="";
                else
                    val=new Date(data[0].date);
            }
            //console.log(val)
            drawDateText(datePosition[index],val,ctx,colors[index+1]);
            if(data[0].data!=undefined){
                drawListText(listPosition[index],data[0].data,ctx,TextColor,isOppsite=!isOppsite,label);
            }
            
        }
        
    });
    return _cricles;
    //var currentPos=drawOneStop(200,20,ctx);
    //drawOneStop(200,currentPos+line2SpotDist,ctx);
}
function drawLine(from,to,ctx,color,size,){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.moveTo(from.x, from.y); 
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    return to.y;
}

function drawIndicatorText(startPos,data,ctx,color){
    ctx.font = 'bold 20px Arial';
    let text_size = getTextSize(data.label,ctx); 
    ctx.beginPath();
    ctx.textStyle = color;
    ctx.fillStyle = color;
    ctx.fillText(data.label, startPos.x-text_size.width/2, startPos.y+text_size.height/2-4);
}
function drawDateText(startPos,val,ctx,color){
    var text=val;
    if(val instanceof Date){
        //console.log('Date',val);
        var offsetX=50;
        text=val.getFullYear()+" | "+val.getMonth()+"月"+val.getDate()+"日";
        ctx.font = 'bold 30px Arial';
        let year_size = getTextSize(val.getFullYear(),ctx); 
        ctx.textStyle = TextColor;
        ctx.fillStyle = TextColor;
        ctx.fillText(val.getFullYear(), startPos.x-offsetX-year_size.width, startPos.y-5);
        ctx.font = '60px Arial';
        let seperater_size = getTextSize("|",ctx); 
        ctx.textStyle = color;
        ctx.fillStyle = color;
        ctx.fillText(" | ", startPos.x-offsetX-seperater_size.width, startPos.y-14);
        ctx.font = 'bold 40px Arial';
        let date_size = getTextSize(val.getMonth()+"月"+val.getDate()+"日",ctx); 
        ctx.textStyle = TextColor;
        ctx.fillStyle = TextColor;
        ctx.fillText(val.getMonth()+"月"+val.getDate()+"日", startPos.x-offsetX+seperater_size.width, startPos.y-10);
    }else{
        ctx.font = 'bold 40px Arial';
        let text_size = getTextSize(text,ctx); 
        ctx.beginPath();
        ctx.textStyle = color;
        ctx.fillStyle = color;
        ctx.fillText(text, startPos.x-text_size.width/2, startPos.y-text_size.height/2);
    }
    
}
function drawListText(startPos,data,ctx,color,isOppsite){
    ctx.font = 'bold 14px 微软雅黑';
    
    ctx.beginPath();
    ctx.textStyle = color;
    ctx.fillStyle = color;
    if (data.length>0){
        data.forEach((item,i)=>{
            //console.log("drawListText...................",item);
            //console.log(item);
            var _data=getEventsDetails(item);
            let text_size = getTextSize(_data.date+_data.description,ctx); 
            //console.log(text+"---"+text_size.width);
            ctx.fillText(_data.date+_data.description, isOppsite?startPos.x-text_size.width-15:startPos.x+15, (startPos.y+20+(text_size.height+5)*i));
        });
    }
    
    
}
function getEventsDetails(item){
    var date;
    var originalDate;
    var text;
    var id;
    var type;
    var key;
    if(item.hasOwnProperty('updatesId')){//updates
        originalDate=new Date(item.dateUpdated);
        date=formatDateTime(new Date(item.dateUpdated),"MM月dd日 ");
        text=getFormatString(add_update_template,item);
        id=item[add_update_template.settings.idkey];
        type=add_update_template.settings.type;
        key=add_update_template.settings.idkey;
        typeName="进展";
    }else if(item.hasOwnProperty('evidenceId')){//evidence
        originalDate=new Date(item.dateUploaded);
        date=formatDateTime(new Date(item.dateUploaded),"MM月dd日 ");
        text=getFormatString(add_evidence_template,item);
        id=item[add_evidence_template.settings.idkey];
        type=add_evidence_template.settings.type;
        key=add_evidence_template.settings.idkey;
        typeName="附件";
    }else if(item.hasOwnProperty('propertyId')){//property
        originalDate=new Date(item.dateOccur);
        date=formatDateTime(new Date(item.dateOccur),"MM月dd日 ");
        text=getFormatString(add_property_template,item);
        id=item[add_property_template.settings.idkey];
        type=add_property_template.settings.type;
        key=add_property_template.settings.idkey;
        typeName="资产";
    }else if(item.hasOwnProperty('excutesId')){//excutes
        originalDate=new Date(item.dateExecuted);
        date=formatDateTime(new Date(item.dateExecuted),"MM月dd日 ");
        text=getFormatString(add_execute_template,item);
        id=item[add_execute_template.settings.idkey];
        type=add_execute_template.settings.type;
        key=add_execute_template.settings.idkey;
        typeName="执行";
    }
    return {date:date,description:text,id:id,type:type,key:key,isInactived:item.isInactived,originalDate:originalDate,typeName:typeName};
}
function getFormatString(template,item){
    var settings=template.settings;
    var _template=template.template;
    var text="";
    if(settings.hasOwnProperty('displayFormat')){
        var format=settings.displayFormat;
        console.log('getFormatString',item);
        $.each(item,(k,v)=>{
            if(_template.hasOwnProperty(k) && _template[k].hasOwnProperty('data')){
                _template[k].data.forEach((data,index)=>{
                    
                    
                    if (data instanceof Object){
                        console.log('getFormatString',data);
                        if(data.id==v){
                            format=format.replace("{"+k+"}",data.label);
                        }
                    }else{
                        if(index==v)
                            format=format.replace("{"+k+"}",data);
                    }
                })
                
            }else
                format=format.replace("{"+k+"}",v);
        })
        text=format;
    }else{
        var vals=[];
        $.each(item,(k,v)=>{
            vals.push(v);
        })
        text=vals.join(' ');
    }
    return text;
}
function drawOneStop(startPos,ctx,color,size,isOppsite,data){
    var insideCircleSize=size+8;
    var indicatorSize=100;
    var _fromX=startPos.x-insideCircleSize;
    var _toX=startPos.x-insideCircleSize-indicatorSize;
    
    //阶段图标线
    ctx.beginPath();
    ctx.strokeStyle = TextColor;
    ctx.lineWidth = 2;
    var iconSize=35;
    var iconStrokeSize=6;
    var nextX=_toX-iconSize-iconStrokeSize;
    if(isOppsite) {
        _fromX=startPos.x+insideCircleSize;
        _toX=startPos.x+insideCircleSize+indicatorSize;
        nextX=_toX+iconSize+iconStrokeSize;
    }
    ctx.moveTo(_fromX, startPos.y); 
    ctx.lineTo(_toX, startPos.y);
    ctx.stroke();
    //图标大圆
    const circle = new Path2D();
    ctx.beginPath();
    
    ctx.lineWidth = 0;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = iconStrokeSize;
    circle.arc(nextX, startPos.y, iconSize, 0, Math.PI*2);
    
    //ctx.stroke(circle);
    ctx.fill(circle);
    
    //ctx.stroke(circle);
    ctx.closePath();

    _cricles.push(circle);
    eventManager.addTarget(circle,ctx,data);

    textPosition.push({x:nextX,y:startPos.y});
    //图标小圆外框
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    if (isOppsite) ctx.arc(_toX+4, startPos.y, 6, 225, Math.PI*2.4);
    else ctx.arc(_toX-4, startPos.y, 6, 90, Math.PI+1.2);
    ctx.stroke();
    ctx.closePath();
    //图标小圆
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.arc(isOppsite?_toX+4:_toX-4, startPos.y, 4, 0, Math.PI*2);
    ctx.stroke();
    ctx.closePath();
    
    //阶段事件线
    var infoSize=250;
    
    var fromX=startPos.x+insideCircleSize;
    var toX=startPos.x+insideCircleSize+infoSize;
    var triangleX=fromX+12;
    var _triangleX=fromX-2;
    var listX=fromX;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    if(isOppsite) {
        fromX=startPos.x-insideCircleSize;
        toX=startPos.x-insideCircleSize-infoSize;
        triangleX=fromX-12;
        _triangleX=fromX+2;
        listX=fromX;
    }
    ctx.moveTo(fromX, startPos.y); 
    ctx.lineTo(toX, startPos.y);
    ctx.stroke();

    datePosition.push({x:toX-(toX-fromX)/2,y:startPos.y});
    listPosition.push({x:listX,y:startPos.y});
    //三角箭头
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(triangleX, startPos.y); 
    ctx.lineTo(_triangleX, startPos.y+8);
    ctx.moveTo(triangleX, startPos.y); 
    ctx.lineTo(_triangleX, startPos.y-8);
    ctx.lineTo(_triangleX, startPos.y+8);
    ctx.fill();
    ctx.closePath();

    //时间事件圆点
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.arc(toX, startPos.y, 2, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.arc(isOppsite?toX-4-1.5:toX+4+1.5, startPos.y, 4, 0, Math.PI*2);
    ctx.stroke();
    ctx.closePath();

    //阶段大点
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.arc(startPos.x, startPos.y, size, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

    //阶段小点
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    if(isOppsite) ctx.arc(startPos.x, startPos.y, insideCircleSize, 225, Math.PI*2.4);
    else ctx.arc(startPos.x, startPos.y, insideCircleSize, 90, Math.PI+1.2);
    ctx.stroke();

    
    ctx.beginPath();
    
    ctx.shadowColor = "black";
    ctx.shadowOffsetY = 2;
    
    ctx.shadowOffsetX = 2;
    ctx.shadowBlur = 8;
    ctx.fillStyle = "white";
    ctx.lineWidth = 1;
    ctx.arc(startPos.x, startPos.y, size/2.5, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    var from={x:startPos.x,y:startPos.y+line2SpotDist};
    var to={x:startPos.x,y:startPos.y+line2SpotDist+stopsGap};
    return drawLine(from,to,ctx,color,size);
}
function getTextSize(text,ctx){
    let metrics = ctx.measureText(text); 
    let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent; 
    return {width:metrics.width,height:actualHeight};
}

//#endregion

