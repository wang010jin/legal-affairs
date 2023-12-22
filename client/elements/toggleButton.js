
$.fn.extend({
    togglebuttonicon:function(target,callback,args){//上过滤栏下拉按钮
        this.opt={
            distance:100,
            duration:500,
        };
        //console.log('hi');
        extendOpt(this.opt,args);
        this.target=(typeof target == 'string')? $('#'+target.replace('#','')):$(target);
        var instance=this;
        this.instance=this;
        $(this).on('click',function(e){
            //console.log($(instance.target).height())
            instance.isTargetToggle=!instance.isTargetToggle;
            if(instance.targetHeight==undefined) {
                instance.targetHeight=$(instance.target).height();
            }
            if(instance.isTargetToggle){
                if(callback!=undefined)callback(instance.isTargetToggle,true);//isbefore=true
                instance.target.animate({height:(instance.targetHeight+instance.opt.distance)+'px'},instance.opt.duration,function(){
                    if(callback!=undefined)callback(instance.isTargetToggle,false);//isbefore=false
                });
            }else{
                
                if(callback!=undefined)callback(instance.isTargetToggle,true);
                instance.target.animate({height:(instance.targetHeight)+'px'},instance.opt.duration,function(){
                    
                    if(callback!=undefined)callback(instance.isTargetToggle,false);
                });
            }
            
        });
        this.togglebutton=function(command){
            
            if(command=='close'){
                console.log('togglebuttonicon',command)
                instance.isTargetToggle=false;
                instance.target.animate({height:(instance.targetHeight)+'px'},instance.opt.duration,function(){
                });
            }else if(command=='open'){
                console.log('togglebuttonicon',command)
                instance.isTargetToggle=true;
                instance.target.animate({height:(instance.targetHeight+instance.opt.distance)+'px'},instance.opt.duration,function(){
                });
            }
        }
        return this;
    },
})

