var event = document.createEvent('Event');

// 定义事件名为'build'.
event.initEvent('build', true, true);

// 监听事件
class StepButton{
  constructor (parent,data) {
        this.background_color = "lightgray";
        this.selected_color="#1362B7";
        this.currentPosition=0;
        this.width=240;
        this.steps=data;
        this.size=10;
        this.line_size=4;
        this.showLabel=true;
        this.parent=parent;
        //this.inital();
  }
  inital(){
    const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));
    var background_color= this.background_color;
    var selected_color= this.selected_color;
    var currentPosition= this.currentPosition;
    var width= this.width;
    var steps= this.steps;
    var size= this.size;
    var line_size= this.line_size;
    var showLabel= this.showLabel;
    var parent= this.parent;
    var step=(width-size*2)/(steps.length-1);
    var div_frame=document.createElement("div");
    div_frame.className="outter";
    this.parent.appendChild(div_frame);
    var div_indicator_line=document.createElement("div");
    div_indicator_line.className="indicator-line";
    div_indicator_line.style.background=selected_color;
    div_indicator_line.style.height=line_size+"px";
    div_indicator_line.style.width=step*currentPosition-size+"px";
    div_indicator_line.style.left=size+"px";
    div_indicator_line.style.top=(size-line_size/2)+"px";
    div_frame.appendChild(div_indicator_line);

    var div_=document.createElement("div");
    div_.style.width="0px";
    div_.classList.add('indicator-front');
    var canvas_circle_=document.createElement("canvas");
    canvas_circle_.left="0px";
    var ctx_ = canvas_circle_.getContext("2d");
    ctx_.moveTo(size, size);
    for(var i=0;i<steps.length;i++){
      ctx_.arc(size+step*i,size,size,0,Math.PI * 2);
    }
    ctx_.fillStyle='blue';
    ctx_.fill();
    div_.appendChild(canvas_circle_);
    //div_frame.appendChild(div_);

    for(var i=0;i<steps.length;i++){
      if(i>0){
        var line_left=size+step*(i-1);
        var div_child_line=document.createElement("div");
        div_child_line.className="inner-line";
        div_child_line.style.width=step+"px";
        div_child_line.style.height=line_size+"px";
        div_child_line.style.left=line_left+"px";
        div_child_line.style.top=(size-line_size/2)+"px";
        div_child_line.style.background=background_color;
        div_child_line.dataset.index=i;
        div_frame.appendChild(div_child_line);
      }
      


      var div_child_circle=document.createElement("div");
      div_child_circle.className="inner-circle";
      div_child_circle.id="circle_"+i;
      div_child_circle.dataset.tooltip="popup_"+i;
      div_child_circle.dataset.index=i;
      //div_child_circle.style.

      div_frame.appendChild(div_child_circle);

      var div_indicator_circle=document.createElement("div");
      div_indicator_circle.id="indicator_circle_"+i;
      div_indicator_circle.dataset.tooltip="popup_"+i;
      div_indicator_circle.dataset.index=i;
      div_indicator_circle.classList.add("indicator-circle");
      if(i>currentPosition) div_indicator_circle.classList.add("hide");
      div_indicator_circle.style.width=(size*2)+"px";
      div_indicator_circle.style.height=(size*2)+"px";
      div_indicator_circle.style.left=(step*i)+"px";
      div_indicator_circle.addEventListener("click", async function (e){
        await _stepAnimation(e,500);
        
      });
      //div_child_circle.style.

      div_frame.appendChild(div_indicator_circle);

      var popup=document.createElement("div");
      popup.dataset.role="popup";
      popup.id="popup_"+i;
      popup.style.tabIndex=-1;
      var tooltip=document.createElement("p");
      tooltip.innerHTML=steps[i];
      popup.appendChild(tooltip);
      div_frame.appendChild(popup);

      div_child_circle.style.width=(size*2)+"px";
      div_child_circle.style.height=(size*2)+"px";
      div_child_circle.style.left=(step*i)+"px";
      div_child_circle.addEventListener("click", async function (e){
        
        await _stepAnimation(e,500);
        
      });
      div_child_circle.addEventListener("mouseout", function (e){
        //$("#"+e.currentTarget.dataset.tooltip).popup( "close");
      });

      var canvas_circle=document.createElement("canvas");
      var ctx = canvas_circle.getContext("2d");
      canvas_circle.width=size*2;
      canvas_circle.height=size*2;
      canvas_circle.style.left=size+step*i;
      //canvas.setAttribute("left",size+step*i+50);
      canvas_circle.style.cursor="pointer";
      ctx.moveTo(size, size);
      ctx.arc(size,size,size,0,Math.PI * 2);
      ctx.fillStyle=background_color;
      ctx.fill();
      div_child_circle.appendChild(canvas_circle);
      if(showLabel){
      var label=document.createElement("span");
      label.innerHTML=steps[i];
      div_child_circle.appendChild(label);

      }

      var _canvas_circle=document.createElement("canvas");
      var _ctx = _canvas_circle.getContext("2d");
      _canvas_circle.width=size*2;
      _canvas_circle.height=size*2;
      _canvas_circle.style.left=size+step*i;
      //canvas.setAttribute("left",size+step*i+50);
      _canvas_circle.style.cursor="pointer";
      _ctx.moveTo(size, size);
      _ctx.arc(size,size,size,0,Math.PI * 2);
      _ctx.fillStyle=selected_color;
      _ctx.fill();
      div_indicator_circle.appendChild(_canvas_circle);
    }
    //$("div[id^='popup_']").
    parent.addEventListener('build', function (e) {
      // e.target matches elem
      console.log("animation--done");
    }, false);
    async function _stepAnimation(event,duration){
      var targetPosition=parseInt(event.currentTarget.dataset.index);
        //console.log(currentPosition+"-->"+targetPosition);
      if(targetPosition>currentPosition){
        for(var ii=currentPosition+1;ii<targetPosition+1;ii++){
          //console.log(ii);
          //$(".indicator-line").data("index",ii);
          await $(".indicator-line").animate({
            width: (step*ii-size)+"px",
              }, duration ,function(){
                parent.dispatchEvent(event);
                //console.log(currentPosition);
                $("#indicator_circle_"+currentPosition).removeClass("hide");
                // currentPosition=parseInt($(this).data("index"));
              });
          await delay(duration-100);
          currentPosition=ii;
        }
      }else{
        for(var ii=currentPosition;ii>=targetPosition;ii--){
          //console.log(ii);
          
          if(currentPosition>0) $("#indicator_circle_"+currentPosition).addClass("hide");
          //$("#indicator_circle_"+currentPosition).addClass("hide");
          await $(".indicator-line").animate({
            width: (step*ii-size)+"px",
              }, duration ,function(){
                parent.dispatchEvent(event);
                
              });
          await delay(duration-100);
          currentPosition=ii;
        }
      }
    }
  }
}