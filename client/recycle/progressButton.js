function extend(opt1,opt2){
    for(var attr in opt2){
        console.log(opt1[attr]+"-->"+opt2[attr]);
        opt1[attr] = opt2[attr];
    }
}

function ProgressButton(arg){
    this.body=document.body;
    this.opt = {
        background_color : "lightgray",
        selected_color:"#1362B7",
        currentPosition:0,
        width:240,
        steps:[],
        size:10,
        fontSize:12,
        line_size:4,
        containerId:'#test1',
        showLabel:true,
        dataId:-1,
        duration:300,
    }
    this.init(arg)
}

ProgressButton.prototype.init=function(arg){
    var _this=this;
    extend(this.opt,arg);
    this.dataId=this.opt.dataId;
    this.parent=$(_this.opt.containerId);
    console.log(_this.opt.containerId);
    var step=parseInt((_this.opt.width-_this.opt.size*2)/(_this.opt.steps.length-1));
    this.step=step;
    //console.log("step: "+(step*this.opt.currentPosition-_this.opt.size));
    this.instance=$('<div class="outter"></div>');
    this.instance.css('width',_this.opt.width+10+"px");
    var indicator_line=$('<div></div>');
    indicator_line.addClass("indicator-line");
    indicator_line.css({
        'background':_this.opt.selected_color,
        'height':_this.opt.line_size+"px",
        'width':(step*this.opt.currentPosition-_this.opt.size)+'px',
        'left':_this.opt.size+'px',
        'top':(_this.opt.size-_this.opt.line_size/2)+'px',
    });
                            
    this.instance.append(indicator_line);
    
    for(var i=0;i<_this.opt.steps.length;i++){
        if(i>0){
            var line_left=_this.opt.size+step*(i-1);
            var background_line=$('<div></div>');
            background_line.addClass("inner-line");
            //background_line.data('index',i);
            background_line.css({
                'background':_this.opt.background_color,
                'height':_this.opt.line_size+'px',
                'width':(step)+'px',
                'left':line_left+'px',
                'top':(_this.opt.size-_this.opt.line_size/2)+'px',
            });
            this.instance.append(background_line);
        }
        //console.log(background_line);
        var indicator_container=$('<div></div>');
        indicator_container.addClass("indicator-circle");
        indicator_container.css({
            "left":(step*i)+"px",
        });

        var indicator=$('<div></div>');
        indicator.addClass("indicator_"+i);
        indicator.css({
            "width":(_this.opt.size*2)+"px",
            "height":(_this.opt.size*2)+"px",
            "borderRadius":(_this.opt.size)+"px",
            "cursor":"pointer",
            "background":_this.opt.selected_color
        });
        indicator.data("index",i);
        if(i>_this.opt.currentPosition){
            indicator.css({"background":_this.opt.background_color});
        }
        indicator.on('click',async function(e){
            //console.log(e.currentTarget);
            $(_this.instance).trigger({type:'stepChanged', position:$(e.currentTarget).data('index'),dataId:_this.dataId});
            await _this.setProgress($(e.currentTarget).data('index'),_this.opt.duration);
            
        });
        indicator_container.append(indicator);
        if(_this.opt.showLabel){
            var label=$('<span>'+this.opt.steps[i]+'</span>');
            label.css('fontSize',this.opt.fontSize+"px");
            indicator_container.append(label);
    
        }
        this.instance.append(indicator_container);
    }
    _this.parent.append(this.instance);
        
    console.log(this.instance.html());
   
}
ProgressButton.prototype.setProgress=async function(targetPosition,duration){
    var _this=this;
    const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));
    console.log(_this.opt.currentPosition+"-->"+targetPosition); 
    //console.log(_this.instance.html());
    if(targetPosition>_this.opt.currentPosition){
        for(var i=_this.opt.currentPosition+1;i<targetPosition+1;i++){
            //console.log(i);
            //$(".indicator-line").data("index",ii);
            var width=(_this.step*i-_this.opt.size)+"px";
            console.log(_this.step);
            await $(_this.instance).find(".indicator-line").animate({
              width: width,
                }, duration ,function(){
                  //console.log(currentPosition);
                  
                  $(_this.instance).find(".indicator_"+_this.opt.currentPosition).css({"background":_this.opt.selected_color});
                  //console.log($(".indicator_"+_this.opt.currentPosition).css("background"));
                  //console.log($("#indicator_circle_"+self.currentPosition));
                  // currentPosition=parseInt($(this).data("index"));
                });
            await delay(duration-100);
            _this.opt.currentPosition=i;
        }
    }else if(targetPosition<_this.opt.currentPosition){
        for(var i=_this.opt.currentPosition;i>=targetPosition;i--){
          //console.log(ii);
          
          if(_this.opt.currentPosition>0) $(_this.instance).find(".indicator_"+_this.opt.currentPosition).css({"background":_this.opt.background_color});
          var width=(_this.step*i-_this.opt.size)+"px";
          console.log(_this.step);
          //console.log($("#indicator_circle_"+self.currentPosition));
          //$("#indicator_circle_"+currentPosition).addClass("indicator-hide");
          await $(_this.instance).find(".indicator-line").animate({
            width: width,
              }, duration ,function(){
                //parent.dispatchEvent(event);
                
              });
          await delay(duration-100);
          _this.opt.currentPosition=i;
        }
      }else{
        /*
        console.log("equals..."+$(".indicator_"+_this.opt.currentPosition).css("background")+"--"+_this.opt.selected_color);
        $(".indicator_"+_this.opt.currentPosition).css({"background":_this.opt.background_color});
        
        _this.opt.currentPosition=-1;
        */
      }
        
    
}