

// 监听事件
class StepButton{
  constructor (data) {
        this.background_color = "lightgray";
        this.selected_color="#1362B7";
        this.currentPosition=0;
        this.width=240;
        this.steps=data;
        this.size=10;
        this.fontSize=12;
        this.line_size=4;
        this.showLabel=true;
        this.indicators=[];
        //this.instance=null;
        //this.inital();
  }
  
  getHTML(){
    return this.instance.outerHTML;
  }
  inital(){
    var _event = document.createEvent('Event');
    _event.initEvent('click', true, true);
    var self=this;
    var background_color= this.background_color;
    var selected_color= this.selected_color;
    var currentPosition= this.currentPosition;
    var width= this.width;
    var steps= this.steps;
    var size= this.size;
    var line_size= this.line_size;
    var showLabel= this.showLabel;
    var fontSize=this.fontSize;
    //var parent= this.parent;
    var step=(width-size*2)/(steps.length-1);
    this.step=step;
    this.instance=document.createElement("div");
    this.instance.className="outter";
    this.instance.style.width=width+10+"px";
    var div_indicator_line=document.createElement("div");
    div_indicator_line.className="indicator-line";
    div_indicator_line.style.background=selected_color;
    div_indicator_line.style.height=line_size+"px";
    div_indicator_line.style.width=step*currentPosition-size+"px";
    div_indicator_line.style.left=size+"px";
    div_indicator_line.style.top=(size-line_size/2)+"px";
    this.instance.appendChild(div_indicator_line);


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
        this.instance.appendChild(div_child_line);
      }
      const div_indicator_container=document.createElement("div");
      div_indicator_container.classList.add("indicator-circle");
      //div_indicator_container.style.width=(size*2)+"px";
      div_indicator_container.style.left=(step*i)+"px";
      div_indicator_container.dataset.index=i;
      var div_indicator_circle=document.createElement("div");
      div_indicator_circle.id="indicator_circle_"+i;
      div_indicator_circle.dataset.tooltip="popup_"+i;
      div_indicator_circle.dataset.index=i;
      //div_indicator_circle.classList.add("indicator-circle");
      div_indicator_circle.style.verticalAlign="middle";
      div_indicator_circle.style.textAlign="left";
      div_indicator_circle.style.width=(size*2)+"px";
      div_indicator_circle.style.height=(size*2)+"px";
      div_indicator_circle.style.borderRadius=(size)+"px";
      div_indicator_circle.style.cursor="pointer";
      div_indicator_circle.style.background=selected_color;
      if(i>currentPosition) {
        
        div_indicator_circle.style.background=background_color;
      }
      div_indicator_container.addEventListener("click", async function (e){
        console.log(self);
        console.log(e);
        await _stepAnimation(e,500);
        
      });
      this.indicators.push(div_indicator_container);
      //div_child_circle.style.
      div_indicator_container.appendChild(div_indicator_circle);
      this.instance.appendChild(div_indicator_container);

      var popup=document.createElement("div");
      popup.dataset.role="popup";
      popup.id="popup_"+i;
      popup.style.tabIndex=-1;
      var tooltip=document.createElement("p");
      tooltip.innerHTML=steps[i];
      popup.appendChild(tooltip);
      //this.instance.appendChild(popup);




      if(showLabel){
        var label=document.createElement("span");
        label.innerHTML=steps[i];
        label.style.fontSize=fontSize+"px";
        div_indicator_container.appendChild(label);

      }
    }
    //console.log(this.instance.outerHTML);
    //$("div[id^='popup_']").
    const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));
    async function _stepAnimation(event,duration){
      var targetPosition=parseInt(event.currentTarget.dataset.index);
      console.log(currentPosition+"-->"+targetPosition);

      if(targetPosition>self.currentPosition){
        for(var ii=self.currentPosition+1;ii<targetPosition+1;ii++){
          //console.log(ii);
          //$(".indicator-line").data("index",ii);
          var width=(step*ii-size)+"px";
          console.log(step);
          await $(".indicator-line").animate({
            width: width,
              }, duration ,function(){
                //console.log(currentPosition);
                $("#indicator_circle_"+self.currentPosition).css("background-color",self.selected_color);
                //console.log($("#indicator_circle_"+self.currentPosition));
                // currentPosition=parseInt($(this).data("index"));
              });
          await delay(duration-100);
          self.currentPosition=ii;
        }
      }else if(targetPosition<self.currentPosition){
        for(var ii=self.currentPosition;ii>=targetPosition;ii--){
          //console.log(ii);
          
          if(self.currentPosition>0) $("#indicator_circle_"+self.currentPosition).css("background-color",self.background_color);
          var width=(step*ii-size)+"px";
          console.log(step);
          //console.log($("#indicator_circle_"+self.currentPosition));
          //$("#indicator_circle_"+currentPosition).addClass("indicator-hide");
          await $(".indicator-line").animate({
            width: width,
              }, duration ,function(){
                //parent.dispatchEvent(event);
                
              });
          await delay(duration-100);
          self.currentPosition=ii;
        }
      }
    }
    
  }
  
}