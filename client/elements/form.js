class error{
    static FORM_VALIDATION_COMPLETED={message:"表格检查完毕。",id:0}
    static FORM_INVALID_USER={message:"您还没有登录。",id:1}
    static FORM_EMPTY_VALUE={message:"信息没有填写完整。",id:2}
}

function mform(arg){
    this.opt = {
        template:FormTemplate,
        buttons:undefined,
    }
    this.replacementIndexs={};
    this.orginalIndexs={};
    this.typeIndexs={};
    this.isReadOnly;
    this.init(arg)
    
}
mform.prototype={
    init:function(arg){
        var _self=this;
        _self.elements={};
        for(var attr in arg){
            //console.log(attr+": "+_self.opt[attr]+"-->"+arg[attr]);
            _self.opt[attr] = arg[attr];
        }
        var template=_self.opt.template;
        //console.log(_self.opt.template);
        if(template.settings.textareaHeight != undefined){
            loadCssCode('textarea.ui-input-text {min-height: '+template.settings.textareaHeight+'px;}')
        }
        var form_width="";
        if(template.settings.textareaHeight != undefined && template.settings.textareaHeight!=Number.NaN){
            form_width=' style="width:'+template.settings.width+';"'
        }
        
        var itemNeedToSetWidth=[];
        //var formItemIds=[];
        _self.instance=$('<form'+form_width+' onsubmit="javascript:return false;"></form>');
        _self.instance.template=template.template;
        if(template.settings.isCollapsibleGrouping){
            var catelogs=Object.keys(template.template);
            catelogs.forEach((catelog_key)=>{
                var catelog=template.template[catelog_key];
                //console.log(catelog);
                catelog_title_bar=$('<div data-role="collapsible" data-theme="b" data-content-theme="a" data-collapsed="false"></div>');
        
                catelog_title_bar.append($('<h4>'+catelog.label+'</h4>'));
                //var catelog_item_keys=Object.keys(catelog.data);
                
                catelog_title_bar.append(setMainForm(catelog.data));
                _self.instance.append(catelog_title_bar);
            });
        }else{
            //console.log('setMainForm',template);
            _self.instance.append(setMainForm(template.template));
        }
        //_self.instance.find('.ui-input-text').addClass('form-original');
        //_self.instance.find('.ui-select').addClass('form-original');
        /*
        $.each(_self.elements,(k,v)=>{
            console.log(k+"------------------------");
            console.log(v);
        });
        */
        //_self.instance.find('select').parent().css("overflow", "auto");
        //_self.instance.trigger('create');
        _self.instance.find('select').parent().addClass('select-overflow');
        $.mobile.document
            .on("pagecreate", function () {
                /*
        itemNeedToSetWidth.forEach((ele)=>{
            if(ele.itemData.type=="combobox" || ele.itemData.type=="multicombobox" || ele.itemData.type=="supermulticombobox" || ele.itemData.type=="supermultiinput"){
                $(ele.element).selectmenu({
                    create: function (event, ui) {
                        console.log('itemNeedToSetWidth',_self.instance.find("#"+$(this).attr('id')+"-button"),ele.itemData.width);
                        $("#"+$(this).attr('id')+"-button").css({'width':ele.itemData.width});
                    }
                });
                //$("#"+$(ele.element).attr('id')+"-button").css({'width':ele.itemData.width});
            }else{
                $(ele.element).css({'width':ele.itemData.width});
            }
            
        })*/
    });
        //_self.instance.find('.supermultiSelect').setSuperMultiselect();
        if (_self.opt.buttons!=undefined) _self.instance.append(_self.opt.buttons);
        //_self.readOnly(true);
        function setMainForm(data){
            var catelog_item_keys=Object.keys(data);
            if(data!=undefined && catelog_item_keys.length>0){
                
                var row_grid=$('<div class="form_grid"></div>');
                var style={};
                if(template.settings.templateColumn!=undefined){
                    var columns=template.settings.templateColumn.split(" ");
                    style=$.extend({}, style, {'gridTemplateColumns':template.settings.templateColumn,'padding-right':(20*(columns.length-1))+"px"});
                }
                if(template.settings.gridStyle!=undefined){
                    //row_grid.css(template.settings.gridStyle);
                    style=$.extend({}, style,template.settings.gridStyle);
                }
                //console.log('form grid style',style);
                row_grid.css(style);
                
                var stepControler=0;
                
                catelog_item_keys.forEach((item_key)=>{
                    //console.log(item_key);
                    var item=data[item_key];
                    //console.log(item.type);
                    if(item.type!=undefined){
                        
                        var item_container=$('<div class="form_item_panel_tb"></div>');
                        if(template.settings.labelPosition != undefined && template.settings.labelPosition=="left"){
                            item_container=$('<div class="form_item_panel"></div>');
                        }
                        _self.typeIndexs[item_key]=item.type.toLowerCase();
                        switch(item.type.toLowerCase()){
                            case "text":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "checkbox":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "textrange":
                                _self.elements[item_key]=generateInputRange(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "number":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "textarea":
                                _self.elements[item_key]=generateTextAreaItem(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "date":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "datetime":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "time":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "tel":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "email":
                                _self.elements[item_key]=generateInputTypeBase(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "password":
                                _self.elements[item_key]=generateInputPassword(item_container,item,item_key,template.settings.hasPlaceHolder);
                                break;
                            case "combobox":
                                _self.elements[item_key]=generateComboBoxItem(item_container,item,item_key);
                                //if(item.width!=undefined) _self.elements[item_key].parent().css({'width':item.width});
                                break;
                            case "multicombobox":
                                //console.log("multicombobox..............................");
                                _self.elements[item_key]=generateMultiComboBoxItem(item_container,item,item_key);
                                break;
                            case "supermulticombobox":
                                //console.log("multicombobox..............................");
                                _self.elements[item_key]=generateSuperMultiComboBoxItem(item_container,item,item_key);
                                break;
                            case "supermultiinput":
                                //console.log("multicombobox..............................");
                                _self.elements[item_key]=generateSuperMultiInputItem(item_container,item,item_key);
                                break;
                            case "radio":
                                _self.elements[item_key]=generateRadioItem(item_container,item,item_key);
                                break;
                            case "file":
                                _self.elements[item_key]=generateFileItem(item_container,item,item_key);
                                break;
                            case "custom":
                                _self.elements[item_key]=generateCustomItem(item_container,item,item_key);
                                break;
                        }
                        if(item.width!=undefined){
                            itemNeedToSetWidth.push({
                                element:_self.elements[item_key],
                                itemData:item,
                            })
                        }
                        if(template.settings.hasOwnProperty('isMini')){
                            if(_self.elements[item_key]!=undefined) _self.elements[item_key].jqmData('mini',template.settings.isMini);
                        }
                        
                        if(item.hasOwnProperty('span')){
                            item_container.css({'grid-column':item.span})
                        }
                        if(item.isDisabled){
                            _self.elements[item_key].attr("disabled",true);
                        }
                        
                        if(item.isAdminOnly){
                            item_container.addClass('admin-ui');
                        }
                        
                        var replacement=replacementOfInput(item_key);
                        item_container.append(replacement);
                        replacement.hide();
                        row_grid.append(item_container);
                    }
                    stepControler++;
                });
            }
            return row_grid;
        }
        function setOptionMark(item){
            if(item.isOptional){
                return "";
            }else{
                return '<span class="optionMark form-original">*</span>';
            }
        }
        function setRequired(isOptional,message){
            return isOptional?"":" data-message='"+message+"' required oninvalid='setCustomValidity(\""+message+"\")' oninput='setCustomValidity(\"\")'";
        }
        //#region 创建表单元素
        function replacementOfInput(id){
            
            var input=$('<label class="form-replacement" id="_'+id+'" style="min-height:25px;">test</label>');
            return input;
        }
        function labelStyle(labelElement,template){
            if(template.settings.hasOwnProperty('labelStyle')){
                $(labelElement).css(template.settings.labelStyle);
            }
        }
        function generateCustomItem(item_container,item){
            item_container.append(item.data);
            item_container.css({'grid-template-columns':'auto'})
            return $(item.data);
        }
        function generateInputTypeBase(item_container,item,id,hasPlaceHolder){
            //var item_container=$('<div class="form_item_panel"></div>');
            var placeholder="";
            if(hasPlaceHolder&&item.placeholder!=undefined) placeholder=' placeholder="'+item.placeholder+'"';
            var val="";
            if(item.type.toLowerCase()=="date"||item.type.toLowerCase()=="time"||item.type.toLowerCase()=="datetime") val=getDateTime();
            var label=$('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            labelStyle(label,template);
            var fileType='';
            if(item.type.toLowerCase()=="file") fileType=' multiple="multiple"';
            var input=$('<input type="'+item.type+'" class="form-original" name="'+id+'" id="'+id+'"'+placeholder+'" value="'+val+'"'+fileType+' '+setRequired(item.isOptional,"此项必须正确填写")+'>');
            var subContainer=$('<div class="form-original"></div>');
            subContainer.append(input);
            item_container.append(subContainer);
            return input;
            //return item_container;
        }
        function generateInputPassword(item_container,item,id,hasPlaceHolder){
            //var item_container=$('<div class="form_item_panel"></div>');
            var placeholder="";
            if(hasPlaceHolder&&item.placeholder!=undefined) placeholder=' placeholder="'+item.placeholder+'"';
            var val="";
            var label=$('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            labelStyle(label,template);
            var input=$('<input type="password" data-wrapper-class="controlgroup-textinput ui-btn" class="form-original" name="'+id+'" id="'+id+'"'+placeholder+'" value="'+val+'" '+setRequired(item.isOptional,"此项必须正确填写")+'>');
            
            var subContainer=$('<div id="'+id+'_controlgroup" data-role="controlgroup" data-type="horizontal" class="form-original"></div>');
            var showHideBtn=$('<a herf="#" class="ui-btn ui-btn-icon-notext ui-icon-eye btn-eye">显示关闭</a>');
            var changePassBtn=$('<a herf="#" class="ui-btn ui-btn-icon-notext btn-icon-blue ui-icon-edit btn-edit">修改</a>');
            subContainer.append(input);
            //subContainer.append(pass);
            subContainer.append(showHideBtn);
            if(item.isChangeable) {
                subContainer.append(changePassBtn);
                input.addClass("ui-state-disabled");
                changePassBtn.on('click',function(e){
                    console.log(changePassBtn.jqmData('icon'));
                    if(changePassBtn.hasClass('ui-icon-edit')){
                        if(!showHideBtn.hasClass('btn-icon-green')){
                            $().requestPasswordToChange(function(res){
                                if(res.success){
                                    setChangeBtnState(changePassBtn,input,true);
                                }else{
                                    $().minfo("show",{message:'密码无效。',type:'alert',title:'错误'});
                                }
                            },'需要输入您的密码以进行下一步。')
                        }else{
                            setChangeBtnState(changePassBtn,input,true);
                        }
                        
                    }else{
                        setChangeBtnState(changePassBtn,input,false);
                    }
                    
                });
            }
            showHideBtn.on('click',function(e){
                var _this=this;
                console.log('showHideBtn');
                if($(input).attr('type')=="text"){
                    
                    setShowHideBtnState(_this,input,true);
                }
                else{
                    if(!changePassBtn.hasClass('ui-icon-check')&&item.isChangeable){
                        $().requestPasswordToChange(function(res){
                            if(res.success){
                                console.log("登陆成功。。")
                                setShowHideBtnState(_this,input,false);
                            }else{
                                $().minfo("show",{message:'密码无效。',type:'alert',title:'错误'});
                            }
                        },'需要输入您的密码以进行下一步。')
                    }else{
                        setShowHideBtnState(_this,input,false);
                    }
                    
                    
                }
                //console.log(input.type)
                input.trigger('create')
                //input.val("changed")
                subContainer.trigger('create');
            })
            item_container.append(subContainer);
            return input;
            //return item_container;
        }
        function setChangeBtnState(btn,input,isActived){
            if(isActived){
                input.removeClass("ui-state-disabled");
                input.trigger('create')
                //input.val("changed")
                //subContainer.trigger('create');
                btn.removeClass('ui-icon-edit').addClass('ui-icon-check');;
                btn.removeClass('btn-icon-blue').addClass('btn-icon-green');
                btn.trigger('create');
                //subContainer.trigger('create');
            }else{
                input.addClass("ui-state-disabled");
                input.trigger('create')
                //input.val("changed")
                //subContainer.trigger('create');
                btn.removeClass('ui-icon-check').addClass('ui-icon-edit');;
                btn.removeClass('btn-icon-green').addClass('btn-icon-blue');
                btn.trigger('create');
                //subContainer.trigger('create');
            }
            
        }
        function setShowHideBtnState(btn,input,isShown){
            if(isShown){
                $(input).attr('type',"password");
                $(btn).removeClass('btn-icon-green');
            }else{
                $(input).attr('type',"text");
                $(btn).addClass('btn-icon-green');
            }
            
        }
        function generateInputRange(item_container,item,id,hasPlaceHolder){
            //var item_container=$('<div class="form_item_panel"></div>');
            var placeholders=[" placeholder=''"," placeholder=''"];
            if(hasPlaceHolder&&item.placeholders!=undefined) {
                placeholders=[]
                item.placeholders.forEach(p=>{
                    placeholders.push(' placeholder="'+p+'"');
                })
            }
            //if(item.type.toLowerCase()=="date"||item.type.toLowerCase()=="time"||item.type.toLowerCase()=="datetime") val=getDateTime();
            var label=$('<label for="'+id+'_0">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            
            labelStyle(label,template);
            var type='text';
            if(item.hasOwnProperty('subType')) type=item.subType;

            var input=$('<input type="'+type+'" class="form-original" name="'+id+'_1" id="'+id+'_0"'+placeholders[0]+'" value="" '+setRequired(item.isOptional,"此项必须填写")+'>');
            var subContainer=$('<div class="form-original" style="display:grid;grid-template-columns: 1fr auto 1fr;grid-gap:0px;"></div>');
            subContainer.append(input);
            var dash=$('<label style="text-align: center;min-width:50px;"> 到 </label>');
            subContainer.append(dash);
            input=$('<input type="'+type+'" class="form-original" name="'+id+'_1" id="'+id+'_1"'+placeholders[1]+'" value="" '+setRequired(item.isOptional,"此项必须填写")+'>');
            subContainer.append(input);
            item_container.append(subContainer);
            return input;
            //return item_container;
        }
        function generateTextAreaItem(item_container,item,id,hasPlaceHolder){
            //var item_container=$('<div class="form_item_panel"></div>');
            var placeholder="";
            if(hasPlaceHolder&&item.placeholder!=undefined) placeholder=' placeholder="'+item.placeholder+'"';
            var textarea=$('<textarea class="form-original" cols="40" rows="4" name="'+id+'" id="'+id+'"'+placeholder+'" '+setRequired(item.isOptional,"此项必须填写")+'></textarea>');
            
            var label=$('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            
            labelStyle(label,template);
            //item_container.append(textarea);
            var subContainer=$('<div class="form-original"></div>');
            subContainer.append(textarea);
            item_container.append(subContainer);
            //item_container.find(".ui-input-text").css({"min-height":"60px"});
            return textarea;
            //console.log(item_container);
            //return item_container;
        }
        function generateFileItem(item_container,item,id){
            //var item_container=$('<div class="form_item_panel"></div>');
            var label=$('<label for="'+id+'_0">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            
            labelStyle(label,template);
            var multiple=item.isMultiple?' multiple="multiple"':'';
            var input=$('<input class="form-original" type="file" name="'+id+'" id="'+id+'" value=""'+multiple+' '+setRequired(item.isOptional,"此项必须填写")+'>');
            //item_container.append(input);
            var subContainer=$('<div class="form-original"></div>');
            subContainer.append(input);
            item_container.append(subContainer);
            return input;
            //return item_container;
        }
        function generateRadioItem(item_container,item,id){
            var radio_container=$('<fieldset class="form-original" id="'+id+'" data-role="controlgroup" data-type="horizontal" data-mini="true"></fieldset>');
            if(item.data){
                item.data.forEach((d,counter)=>{
                    var check="";
                    if(counter==0){
                        check='checked="checked"';
                    }
                    if(d instanceof Object){
                        var text=d;
                        var valueIndex=counter;
                        if(item.hasOwnProperty('displayFormat')){
                            text=item.displayFormat;
                            $.each(d,(k,v)=>{
                                text=text.replace("{"+k+"}",v);
                            })
                        }
                        if(item.hasOwnProperty('valueKey')){
                            $.each(d,(k,v)=>{
                                if(k==item.valueKey) {
                                    valueIndex=v;
                                    return false;
                                }
                            })
                        }
                        radio_container.append($('<input type="radio" name="'+id+'" id="'+id+'-'+valueIndex+'" data-label="'+text+'" value="'+valueIndex+'" '+check+'>'+
                        '<label for="'+id+'-'+valueIndex+'">'+text+'</label>'));
                    }else{
                        radio_container.append($('<input type="radio" name="'+id+'" id="'+id+'-'+counter+'" data-label="'+d+'" value="'+counter+'" '+check+'>'+
                        '<label for="'+id+'-'+counter+'">'+d+'</label>'));
                    }
                });
            }
            //var item_container=$('<div class="form_item_panel"></div>');
            var label=$('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            
            labelStyle(label,template);
            var subContainer=$('<div class="form-original"></div>');
            subContainer.append(radio_container);
            item_container.append(subContainer);
            //item_container.append(radio_container);
            return radio_container;
            //return item_container;
        }
        function generateComboBoxItem(item_container,item,id){
            //console.log('generateComboBoxItem',item.label,item.data);
            var selectItem=$('<select name="'+id+'" id="'+id+'"'+
            (item.isFilterable?"class=\"filterSelect\" data-native-menu=\"false\"":"class=\"form-original\"")+'" '+setRequired(item.isOptional,"此项必须选择")+'></select>');
            if(item.data!=undefined){
                if(item.data instanceof Array){
                    item.data.forEach((d,counter)=>{
                        //console.log()
                        if(d==null) d="";
                        if(d.constructor === Object){//'{name} {contact} {institution}'
                            var label="";
                            if(item.hasOwnProperty('displayFormat')){
                                var displayFormat=item.displayFormat;
                                $.each(d,(kk,vv)=>{
                                    //console.log(kk+"----displayFormat--->"+(item.displayFormat.indexOf(kk)>-1));
                                    if(item.displayFormat.indexOf(kk)>-1){
                                        displayFormat=displayFormat.replace("{"+kk+"}",vv);
                                    }
                                })
                                label=displayFormat;
                            }else{
                                var collector=[];
                                $.each(d,(kk,vv)=>{
                                    collector.push(vv);
                                })
                                label=collector.join(" ");
                            }
                            var _value=d.hasOwnProperty(item.valueKey)?d[item.valueKey]:counter;
                            selectItem.append($('<option value="'+_value+'">'+label+'</option>'));
                        }else
                            selectItem.append($('<option value="'+counter+'">'+d+'</option>'));
                    });
                }else{
                    $.each(item.data,function(key,value){
                        if(key=="无"){
                            selectItem.append($('<option value="'+key+0+'">'+key+'</option>'));
                        }else{
                            var grounp=$('<optgroup label="'+key+'"></optgroup>')
                            value.forEach((d,counter)=>{
                                console.log(d)
                                console.log((d.constructor === Object))
                                if(d.constructor === Object){//'{name} {contact} {institution}'
                                    var label="";
                                    if(item.hasOwnProperty('displayFormat')){
                                        var displayFormat=item.displayFormat;
                                        $.each(d,(kk,vv)=>{
                                            console.log(kk+"----displayFormat--->"+(item.displayFormat.indexOf(kk)>-1));
                                            if(item.displayFormat.indexOf(kk)>-1){
                                                displayFormat=displayFormat.replace("{"+kk+"}",vv);
                                            }
                                        })
                                        label=displayFormat;
                                    }else{
                                        var collector=[];
                                        $.each(d,(kk,vv)=>{
                                            collector.push(vv);
                                        })
                                        label=collector.join(" ");
                                    }
                                    var _value=d.hasOwnProperty(item.valueKey)?d[item.valueKey]:key+counter;
                                    grounp.append($('<option value="'+_value+'">'+label+'</option>'));
                                }else{

                                    grounp.append($('<option value="'+key+counter+'">'+d+'</option>'));
                                }
                            });
                            selectItem.append(grounp);
                        }
                        
                    
                    })
                }
                
            }
            //var item_container=$('<div class="form_item_panel"></div>');
            var label=$('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            
            labelStyle(label,template);
            //item_container.append(selectItem);
            var subContainer=$('<div class="form-original"></div>');
            subContainer.append(selectItem);
            item_container.append(subContainer);
            //selectItem.selectmenu().selectmenu('refresh');
            return selectItem;
            //return item_container;
        }
        function generateMultiComboBoxItem(item_container,item,id){
            
            var selectItem=$('<select name="'+id+'[]" id="'+id+'" '+setRequired(item.isOptional,"此项必须选择")+' class="form-original multiSelect'+
            (item.isFilterable?" filterSelect":"")+'" multiple="multiple" data-native-menu="false"></select>');
            if(item.data){
                if(item.data instanceof Array){
                    item.data.forEach((d,counter)=>{
                        if(d.constructor === Object){//'{name} {contact} {institution}'
                            var label="";
                            if(item.hasOwnProperty('displayFormat')){
                                var displayFormat=item.displayFormat;
                                $.each(d,(kk,vv)=>{
                                    //console.log(kk+"----displayFormat--->"+(item.displayFormat.indexOf(kk)>-1));
                                    if(item.displayFormat.indexOf(kk)>-1){
                                        displayFormat=displayFormat.replace("{"+kk+"}",vv);
                                    }
                                })
                                label=displayFormat;
                            }else{
                                var collector=[];
                                $.each(d,(kk,vv)=>{
                                    collector.push(vv);
                                })
                                label=collector.join(" ");
                            }
                            var _value=d.hasOwnProperty(item.valueKey)?d[item.valueKey]:counter;
                            selectItem.append($('<option value="'+_value+'">'+label+'</option>'));
                        }else
                            selectItem.append($('<option value="'+counter+'">'+d+'</option>'));
                    });
                }else{
                    var opt_tip=$('<option></option>');
                    var tips=[];
                    $.each(item.data,function (key,value) {
                        if(key=="无"){
                            selectItem.append($('<option value="'+key+0+'">'+key+'</option>'));
                        }else{
                            //console.log(value,value instanceof String);
                            if(value.constructor === String){
                                selectItem.append($('<option value="'+key+'">'+value+'</option>'));
                            }else{
                                tips.push(key);
                                var grounp=$('<optgroup label="'+key+'"></optgroup>')
                                value.forEach((d,counter)=>{
                                    //console.log(d)
                                    //console.log((d.constructor === Object))
                                    if(d.constructor === Object){//'{name} {contact} {institution}'
                                        var label="";
                                        if(item.hasOwnProperty('displayFormat')){
                                            var displayFormat=item.displayFormat;
                                            $.each(d,(kk,vv)=>{
                                                //console.log(kk+"----displayFormat--->"+(item.displayFormat.indexOf(kk)>-1));
                                                if(item.displayFormat.indexOf(kk)>-1){
                                                    displayFormat=displayFormat.replace("{"+kk+"}",vv);
                                                }
                                            })
                                            label=displayFormat;
                                        }else{
                                            var collector=[];
                                            $.each(d,(kk,vv)=>{
                                                collector.push(vv);
                                            })
                                            label=collector.join(" ");
                                        }
                                        var _value=key+counter;
                                        if(item.hasOwnProperty('valueKey')){
                                            _value=key+d[item.valueKey];
                                        }
                                        if(item.hasOwnProperty('valueFormat')){
                                            var _value=item.valueFormat;
                                            //console.log();
                                            if(_value.indexOf('key')>-1){
                                                _value = _value.replace('{key}',key)
                                            }
                                            $.each(d,(kk,vv)=>{
                                                _value = _value.replace('{'+kk+'}',vv)
                                            });
                                            
                                            //d.hasOwnProperty(item.matchKey)?d[item.matchKey]:)
                                        }
                                        grounp.append($('<option value="'+_value+'">'+label+'</option>'));
                                    }else{
    
                                        grounp.append($('<option value="'+key+counter+'">'+d+'</option>'));
                                    }
                                });
                                selectItem.append(grounp);
                            }
                            
                        }
                        
                    })
                    opt_tip.text("选择 "+tips.join(" 或 "));
                }
                
            }
            var label=$('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            
            labelStyle(label,template);
            //item_container.append(selectItem);
            var subContainer=$('<div class="form-original"></div>');
            subContainer.append(selectItem);
            item_container.append(subContainer);
            //console.log(item_container.html());
            //selectItem.selectmenu().selectmenu('refresh');
            return selectItem;
            //console.log('item_container');
            //console.log(item_container.html());
            //return item_container;
        }
        function generateSuperMultiComboBoxItem(item_container,item,id){
            
            var selectItem=$('<select name="'+id+'[]" id="'+id+'" '+
                setRequired(item.isOptional,"此项必须选择")+' class="form-original multiSelect supermultiSelect'+(item.isFilterable?" filterSelect":"")+'"'+
            ' data-displayFormat="'+item.displayFormat+'"'+' data-optionFormat="'+item.optionFormat+'"'+' multiple="multiple" data-native-menu="false"></select>');
            if(item.data){
                if(item.data instanceof Array){
                    item.data.forEach((d,counter)=>{
                        //console.log(d)
                        selectItem.append($('<option value="'+counter+'">'+d+'</option>'));
                    });
                }else{
                    var opt_tip=$('<option></option>');
                    var tips=[];
                    $.each(item.data,function (key,value) {
                        if(key=="无"){
                            selectItem.append($('<option value="'+key+0+'">'+key+'</option>'));
                        }else{
                            tips.push(key);
                            var grounp=$('<optgroup label="'+key+'"></optgroup>')
                            value.forEach((d,counter)=>{
                                //console.log('generateSuperMultiComboBoxItem',d,item)
                                //console.log((d.constructor === Object))
                                if(d.constructor === Object){//'{name} {contact} {institution}'
                                    var label="";
                                    if(item.hasOwnProperty('optionFormat')){
                                        var optionFormat=item.optionFormat;
                                        $.each(d,(kk,vv)=>{
                                            //console.log(kk+"----optionFormat--->"+(item.optionFormat.indexOf(kk)>-1));
                                            if(item.optionFormat.indexOf(kk)>-1){
                                                optionFormat=optionFormat.replace("{"+kk+"}",vv);
                                            }
                                        })
                                        label=optionFormat;
                                    }else{
                                        var collector=[];
                                        $.each(d,(kk,vv)=>{
                                            collector.push(vv);
                                        })
                                        label=collector.join(" ");
                                    }
                                    
                                    var _value=key+counter;
                                    if(item.hasOwnProperty('valueFormat')){
                                        var _value=item.valueFormat;
                                        //console.log();
                                        if(_value.indexOf('key')>-1){
                                            _value = _value.replace('{key}',key)
                                        }
                                        $.each(d,(kk,vv)=>{
                                            _value = _value.replace('{'+kk+'}',vv)
                                        });
                                        
                                        //d.hasOwnProperty(item.matchKey)?d[item.matchKey]:)
                                    }
                                    //console.log("option set",d,item.matchKey,_value);
                                    grounp.append($('<option value="'+_value+'">'+label+'</option>'));
                                }else{

                                    grounp.append($('<option value="'+key+counter+'">'+d+'</option>'));
                                }
                            });
                            selectItem.append(grounp);
                            
                            
                        }
                        
                    })
                    opt_tip.text("选择 "+tips.join(" 或 "));
                }
                
            }
            var label=$('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            
            labelStyle(label,template);
            //item_container.append(selectItem);
            var tooltip=$('<span id="'+id+'_tooltip" class="tooltip-form">开启搜索</span>')
            var subContainer=$('<div class="form-original"></div>');
            //selectItem.jqmData('optionFormat',item.optionFormat);
            //selectItem.jqmData('displayFormat',item.displayFormat);
            subContainer.append(selectItem);
            subContainer.append(tooltip);
            if(item.hasOwnProperty('optionFormat')){
                subContainer.jqmData('optionFormat',item.optionFormat);
                
                //console.log("value-format1",subContainer);
                //console.log("value-format1",subContainer.jqmData('optionKey'));
            }
            item_container.append(subContainer);
            //console.log(item_container.html());
            //selectItem.selectmenu().selectmenu('refresh');
            return selectItem;
            //console.log('item_container');
            //console.log(item_container.html());
            //return item_container;
        }
        function generateSuperMultiInputItem(item_container,item,id){
            
            var selectItem=$('<select name="'+id+'[]" id="'+id+'" '+
            setRequired(item.isOptional,"此项必须选择")+' class="form-original multiSelect supermultiInput'+(item.isFilterable?" filterSelect":"")+
            ' data-displayFormat="'+item.displayFormat+'"'+' data-optionFormat="'+item.optionFormat+'"'+'" multiple="multiple" data-native-menu="false"></select>');

            var label=$('<label for="'+id+'">'+setOptionMark(item)+item.label+'</label>');
            item_container.append(label);
            
            labelStyle(label,template);
            //item_container.append(selectItem);
            var tooltip=$('<span id="'+id+'_tooltip" class="tooltip-form">开启搜索</span>')
            var subContainer=$('<div class="form-original"></div>');
            subContainer.append(selectItem);
            subContainer.append(tooltip);
            //$(select).off('selectChange',"**");
            
            if(item.hasOwnProperty('optionFormat')){
                subContainer.jqmData('optionFormat',item.optionFormat);
                
                //console.log("value-format1",subContainer);
                //console.log("value-format1",subContainer.jqmData('optionFormat'));
            }
            item_container.append(subContainer);
            //console.log(item_container.html());
            //selectItem.selectmenu().selectmenu('refresh');
            return selectItem;
            //console.log('item_container');
            //console.log(item_container.html());
            //return item_container;
        }
        function pageIsSelectmenuDialog( page ) {
            var isDialog = false,
            id = page && page.attr( "id" );
            $( ".filterSelect" ).each( function() {
                if ( $( this ).attr( "id" ) + "-dialog" === id ) {
                    isDialog = true;
                    return false;
                }
            });
            return isDialog;
        }
        
        function OnSelectChanged(){
            
            
        }
        $.mobile.document
            .on("pagecreate", function () {
                $(".supermultiInput").selectmenu({
                    create: function (event, ui) {
                        
                        $.each($(this),(index,select)=>{
                            if(select.nodeName=="SELECT"){
                                    
                                //*******修复点击打开其它带索引的下拉菜单导致初始数据丢失*********
                                $(select).setSuperMultiselectA($(select).parent().parent().jqmData('optionFormat'));
                                $(select).on('selectChange',function(e){
                                    var id=$(this).attr('id');
                                    $(this).closest('form').jqmData('datas')[id]=_getSuperValue($(this).attr('id'),'{statusId}{value}').join(",");
                                });

                                if($(select).closest('form').jqmData('datas')!=undefined){
                                    superMultiSelectSetDatas(select.id,$(select).closest('form').jqmData('datas')[select.id].split(','));
                                    _setSuperLabel(select.id,'{value} ({status})');
                                }
                                //*******修复点击打开其它带索引的下拉菜单导致初始数据丢失*********
                            }
                                
                        })
                        var id=this.id;
                        $.each($('#'+this.id+'-button').find('span'),(idx,el)=>{
                            //var isOpened
                            $(el).on('mouseover',(e)=>{
                                if (el.scrollWidth > el.clientWidth) {
                                    //console.log('over',$('#'+id+'_tooltip'));
                                    $('#'+id+'_tooltip').html($(el).text().split(',').join('<br/>'));
                                    $('#'+id+'_tooltip').css({'visibility': 'visible','opacity': '1','min-width':$(el).css('width')})
                                }
                              });
                              
                              $(el).on('mouseleave',(e)=>{
                                //console.log('leave',$('#'+id+'_tooltip'));
                                $('#'+id+'_tooltip').css({'visibility': 'hidden','opacity': '0'})
                                
                                
                              
                            });
                        })
                            
                        
                    }
                });
            });
            var initalList=[];
        $.mobile.document
            .on("pagecreate", function () {
                
                //console.log('itemNeedToSetWidth','pagecreate');
                $(".supermultiSelect").selectmenu({
                    create: function (event, ui) {
                        //console.log('supermultiSelect pagecreate',this);
                        
                        $.each($(this),(index,select)=>{
                            //console.log('nodeName supermultiSelect',select.nodeName,select.id);
                            //console.log("value-format2",index,"__",$(select).parent().parent());
                            //console.log("value-format2",index,"__",$(select).parent().parent().jqmData('optionKey'));
                            if(select.nodeName=="SELECT")
                                $(select).setSuperMultiselect();
                        })
                        var id=this.id;
                        $.each($('#'+id+'-button').find('span'),(idx,el)=>{
                            //var isOpened
                            
                            $(el).on('mouseover',(e)=>{
                                if (el.scrollWidth > el.clientWidth) {
                                    //console.log('over',$('#'+id+'_tooltip'));
                                    $('#'+id+'_tooltip').html($(el).text().split(',').join('<br/>'));
                                    $('#'+id+'_tooltip').css({'visibility': 'visible','opacity': '1','min-width':$(el).css('width')})
                                }
                              });
                              
                              $(el).on('mouseleave',(e)=>{
                                //console.log('leave',$('#'+id+'_tooltip'));
                                $('#'+id+'_tooltip').css({'visibility': 'hidden','opacity': '0'})
                                
                                
                              
                            });
                        })
                            
                        
                    }
                });
                
                //$(".supermultiSelect").selectmenu().selectmenu("refresh").trigger("change");
            })
        $.mobile.document
            // Upon creation of the select menu, we want to make use of the fact that the ID of the
            // listview it generates starts with the ID of the select menu itself, plus the suffix "-menu".
            // We retrieve the listview and insert a search input before it.
            .on( "selectmenucreate", ".filterSelect", function( event ) {
                
                //console.log(" filterSelect--->",$( event.target ).hasClass('supermultiSelect'));
                
                //if($( event.target ).hasClass('supermultiInput')) {
                    //if(initalList.includes($( event.target ).attr( "id" ))) return;
                    //initalList.push($( event.target ).attr( "id" ));
               // }
                //console.log('selectmenucreate',$( event.target ).attr( "id" ));
                var input,
                    selectmenu = $( event.target ),
                    list = $( "#" + selectmenu.attr( "id" ) + "-menu" ),
                    form = list.jqmData( "filter-form" );

                
                // We store the generated form in a variable attached to the popup so we avoid creating a
                // second form/input field when the listview is destroyed/rebuilt during a refresh.
                
                if ( !form ) {
                    //$("#filterForm").remove();
                    input = $( "<input data-type='search'></input>" );
                    form = $( "<form></form>" ).append( input );
                    input.textinput();
                    list
                        .before( form )
                        .jqmData( "filter-form", form ) ;
                    form.jqmData( "listview", list );
                    list.jqmData('theme','a');
                    
                    //list.listview( "refresh" );
                }
                selectmenu.jqmData('theme','a');
                var listbox=$( "#" + selectmenu.attr( "id" ) + "-listbox" );
                listbox.addClass('filterable-select-listbox');
                list.addClass('filterable-select-option');
                //selectmenu.addClass('filterable-select-option');
                //listbox.trigger('create');
                //listbox.find('a').css({'color':"#333",'border-color':"gray"});
                //selectmenu.selectmenu().selectmenu('refresh', true);
                //$( "#" + selectmenu.attr( "id" ) + "-listbox-popup" ).popup();
                //list.listview( "refresh" ).trigger('create');
                //selectmenu.trigger('create');
                //console.log(list.html());
                // Instantiate a filterable widget on the newly created selectmenu widget and indicate that
                // the generated input form element is to be used for the filtering.
                //console.log($(form).html());
                var isOptgroup=$(selectmenu).find('optgroup').length>0;
                selectmenu
                    .filterable({
                        input: input,
                        children: "> "+(isOptgroup?"optgroup":"")+" option[value]"
                    })
                    // Rebuild the custom select menu's list items to reflect the results of the filtering
                    // done on the select menu.
                    .on( "filterablefilter", function() {
                        selectmenu.selectmenu().selectmenu( "refresh" );
                    });
            })
            // The custom select list may show up as either a popup or a dialog, depending on how much
            // vertical room there is on the screen. If it shows up as a dialog, then the form containing
            // the filter input field must be transferred to the dialog so that the user can continue to
            // use it for filtering list items.
            .on( "pagecontainerbeforeshow", function( event, data ) {
                
                
                //console.log('pagecontainerbeforeshow',$( event.target ),$(data.toPage).attr('id').replace('-dialog',''));
                var listview, form;
                if ( !pageIsSelectmenuDialog( data.toPage ) ) {
                    
                    //return;
                }
                var id=$(data.toPage).attr('id').replace('-dialog','');
                data.toPage.find('a.ui-icon-delete').on('click',function(e){
                    //console.log('pagecontainerhide',$(data.toPage).find('input[data-type="search"]').val());
                    if ( pageIsSelectmenuDialog( data.toPage ) ) {
                        $(data.toPage).find('input[data-type="search"]').val('');
                        $(data.toPage).find('input[data-type="search"]').trigger('keyup');
                    }
                    
                })
                listview = data.toPage.find( "ul[id^="+id+"]" );
                
                //console.log('data.prevPage',listview);
                //console.log('pagecontainerbeforeshow',listview);
                //console.log(listview.html());
                form = listview.jqmData( "filter-form" );
                // Attach a reference to the listview as a data item to the dialog, because during the
                // pagecontainerhide handler below the selectmenu widget will already have returned the
                // listview to the popup, so we won't be able to find it inside the dialog with a selector.
                data.toPage.jqmData( "listview", listview );
                // Place the form before the listview in the dialog.
                //if($('#'+id+'-searchInput').length==0)
                    listview.before( form );
                
                //listview.addClass('filterable-select-option');
                //listview.trigger('create').listview().listview( "refresh" );
                //listview.parent().trigger('create');
            })
            // After the dialog is closed, the form containing the filter input is returned to the popup.
            .on( "pagecontainerhide", function( event, data ) {
                
                //console.log('pagecontainerhide');
                var listview, form;
                if ( !pageIsSelectmenuDialog( data.toPage ) ) {
                    //console.log('pagecontainerhide1',$(data.toPage).find('input[data-type="search"]').val());
                    return;
                }
                console.log('data.prevPage',data.prevPage);
                if(listview==undefined) return;
                listview = data.prevPage.jqmData( "listview" ),
                //console.log(data);
                form = listview.jqmData( "filter-form" );
                // Put the form back in the popup. It goes ahead of the listview.
                //if($('#'+id+'-searchInput').length==0)
                    listview.before( form );
            });
            //#endregion
    },
    readOnly:function(isReadOnly){
        //if(isReadOnly) this.replacementIndexs={};
        //console.log("isReadOnly........................."+isReadOnly+"--"+this.isReadOnly);
        if(isReadOnly==1) isReadOnly=true;
        if(this.isReadOnly==isReadOnly) return this;
        this.isReadOnly=isReadOnly;
        var _self=this;
        if(isReadOnly){
            $.each(_self.instance.find('.form-original'),(i,ele)=>{
                //console.log(ele.nodeName+"-->"+ele.id);
                //console.log(ele);
                var id=ele.id;
                switch(ele.nodeName.toUpperCase()){
                    case "INPUT":
                        //console.log($(ele).prop('type'));
                        if(ele.type=="date"||ele.type=="datetime"){
                            _self.instance.find('#_'+id).text(formatDateTime(new Date($(ele).val()),"yyyy年MM月dd日"));
                        }else{
                            _self.instance.find('#_'+id).text($(ele).val());

                        }
                        break;
                    case "TEXTAREA":
                        _self.instance.find('#_'+id).text($(ele).val());
                        break;
                    case "SELECT":
                        _self.instance.find('#_'+id).html(getSelectValue(ele).join('<br/>'));
                        break;
                    case "FIELDSET":
                        _self.instance.find('#_'+id).html(getRadioValue(ele).join('<br/>'));
                        break;
                }
            });
        }
        if(this.isReadOnly){
            _self.instance.find(".form-replacement").show();
            _self.instance.find('.ui-input-text').hide();
            _self.instance.find('.form-original').hide();
            _self.instance.find('.ui-select').hide();
        }else{
            _self.instance.find(".form-replacement").hide();
            _self.instance.find('.form-original').show();
            _self.instance.find('.ui-input-text').show();
            _self.instance.find('.ui-select').show();
        }
        //if(this.isReadOnly) _self.instance.find('.optionMark').addClass('hide');
        //else _self.instance.find('.optionMark').removeClass('hide');
        _self.instance.trigger('create');

        function getSelectValue(element){
            var val=[];
            if($(element).hasClass('supermultiSelect')){
                $.each($(element).find(":selected"),function(index,opt){
                    //console.log('itemTemplate.label',$(opt).jqmData('statusValue'));
                    //if($(opt).jqmData('statusValue')!=undefined)
                    var fvalue=formatSuperMultiSelectOptionValue(($(opt).jqmData('statusValue')!=undefined?$(opt).jqmData('statusValue'):"")+opt.value);
                    var status=fvalue.status;

                    if(template.displayFormat!=undefined){
                        var displayFormat=template.displayFormat;
                        $.each(fvalue,(kk,vv)=>{
                            //console.log(kk+"----displayFormat--->"+(item.displayFormat.indexOf(kk)>-1));
                            if(displayFormat.indexOf(kk)>-1){
                                displayFormat=displayFormat.replace("{"+kk+"}",vv);
                            }
                        })
                        
                    
                        val.push(displayFormat);
                        
                    }else{
                        val.push(opt.text+"("+status+")");
                    }

                    
                });
            }else if($(element).hasClass('supermultiInput')){
                var val=_setSuperLabel($(element).attr('id'),'{value} ({status})');
            }else{
                $.each($(element).find(":selected"),function(index,opt){
                    //console.log(itemTemplate.label+"--------->"+opt.value);
                    val.push(opt.text);
                });
            }
            
            return val;
        }
        function getRadioValue(element){
            var val=[];
            $.each($(element).find(":checked"),function(index,opt){
                //console.log(itemTemplate.label+"--------->"+opt.value);
                val.push(opt.value);
            });
            return val;
        }
        return _self;
    },
    setEmptyData:function(template){
        var _self=this;
        if(template==undefined) template=_self.instance.template;
        _self.instance.setEmptyData(template);
        return _self;
    },
    setData:function(data,template){
        var _self=this;
        
        this.data=data;
        //console.log(data);
        if(template==undefined) template=_self.instance.template;
        _self.instance.setData(data,template);
        return _self;
    }
}
$.fn.extend({
    setEmptyData:function(template){
        var _self=this;
        $(_self).jqmData('datas',{});
        if(template==undefined) template=_self.template;
        console.log('setEmptyData template',template);
        $.each(template,(k,v)=>{
            var val=undefined;
            if(v.hasOwnProperty('type')){//如果是表格元素
                if(k.nodeName=="input") val="";
                if(v.defaultValue!=undefined) val=v.defaultValue;
                _self.addData(v,k,val);
                $(_self).jqmData('datas')[k]=val;
            }else{
                if(v.hasOwnProperty('data')){//如果是元素父级
                    
                    $.each(v.data,(kk,vv)=>{
                        var _val=undefined;
                        if(vv.hasOwnProperty('type')){
                            if(kk.nodeName=="input") _val="";
                            if(vv.defaultValue!=undefined) _val=vv.defaultValue;
                            _self.addData(vv,kk,_val);
                            $(_self).jqmData('datas')[kk]=_val;
                            
                        }
                    })
                }
            }
        });
    },
    setData:function(data,template){
        
        //console.log("setData....")
        $(this).jqmData('datas',data);
        var data_keys=Object.keys(data);
        var _self=$(this);
        if(template==undefined) template=_self.template;
        console.log("setData....",data)
        $.each(template,(k,v)=>{
            if(v.hasOwnProperty('type')){
                var val=data[k.replace('_p','')];
                console.log(k.replace('_p',''),val)
                if(data_keys.includes(k.replace('_p',''))||(v.type=="textrange" && (data_keys.includes(k.replace('_0',''))||data_keys.includes(k.replace('_1',''))))){
                    if(v.defaultValue!=undefined && (val==undefined || val.length==0)) val=v.defaultValue;
                    _self.addData(v,k,val);
                }
            }else{
                if(v.hasOwnProperty('data')){
                    $.each(v.data,(kk,vv)=>{
                        if(vv.hasOwnProperty('type')){
                            var _val=data[kk];
                            if(data_keys.includes(kk)||(v.type=="textrange" && (data_keys.includes(k.replace('_0',''))||data_keys.includes(k.replace('_1',''))))){
                                if(vv.defaultValue!=undefined && (_val==undefined || _val.length==0)) _val=vv.defaultValue;
                                _self.addData(vv,kk,_val);
                            }
                        }
                    })
                }
            }
        });
        //_self.trigger('create');
    },
    addData:function(template,id,value,element){
        var type=template.type;
        if(value==undefined) value="";
        var _self=$(this);
        if(element==undefined) element=_self.find('#'+id);
        if(element.length>0){
            if(type=="radio")  {
                if(value=="") value=0;
                var eles=_self.find("input[id^="+id+"]");
                eles.prop( "checked", false );
                if(eles.length>0){
                    $.each(eles,(index,ele)=>{
                        if($(ele).val()==value){
                            $(ele).prop( "checked", true );
                            
                            console.log("radio",$(ele).data('label'));
                            _self.find("#_"+id).text($(ele).data('label'));
                        }else{
                            $(ele).prop( "checked", false );
                        }
                        $(ele).checkboxradio().checkboxradio( "refresh" ).trigger("change");
                    })
                }
                    
            }else if(type=="multicombobox"){
                var _values=[];
                $(element).find("option").prop('selected',false);
                //console.log(id+"--->"+value+"--"+(value!=null));
                //console.log(id+"--->"+value+"--"+(value!=undefined));
                //console.log(id+"--->"+value+"--"+(Number.isInteger(value)||value.length>0));
                if(value!=null&&value!=undefined&&(Number.isInteger(value)||value.length>0)){
                    //console.log(id+"--->"+Number.isInteger(value));
                    if(Number.isInteger(value)){
                        var ele=$(element).find("option[value="+value+"]");
                        if(ele.length>0){
                            ele.prop('selected',true);
                            _values.push(ele.text());
                        }
                            
                    }else{
                        value.split(",").forEach((v)=>{
                            //console.log(id+"--->"+v);
                            var ele=$(element).find("option[value="+v+"]");
                            //console.log($(element).html());
                            //console.log(ele);
                            ele.prop('selected',true);
                            _values.push(ele.text());
                        });

                    }
                    
                }else{
                    var ele=$(element).find("option[value='无0']");
                        if(ele.length>0){
                            ele.prop('selected',true);
                            _values.push(ele.text());
                        }
                }
                _self.find("#_"+id).html(_values.join("<br/>"));
                element.selectmenu().selectmenu("refresh").trigger("change");
            }else if(type=="supermulticombobox"){
                var _values=[];//只是给只读时候label的值
                var _valueData=[];
                $(element).find("option").prop('selected',false);
                //console.log(id+"--->"+value+"--"+(value!=null));
                //console.log(id+"--->"+value+"--"+(value!=undefined));
                //console.log(id+"--->"+value+"--"+(Number.isInteger(value)||value.length>0));
                if(value!=null&&value!=undefined&&(Number.isInteger(value)||value.length>0)){
                    //console.log(id+"--->"+Number.isInteger(value));
                    if(Number.isInteger(value)){
                        var ele=$(element).find("option[value="+value+"]");
                        if(ele.length>0){
                            ele.prop('selected',true);
                            _values.push(ele.text());
                            _valueData.push({
                                status:"无",
                                statusId:0,
                                value:ele.text(),
                                valueId:ele.val(),
                                catelog:"",
                                catelogId:0
                            })
                        }
                            
                    }else{
                        value.split(",").forEach((v)=>{
                            //console.log(id+"--->"+v);
                            var _v=formatSuperMultiSelectOptionValue(v,template.valueKey,template.matchKey);
                            console.log('formatSuperMultiSelectOptionValue',_v,template,template.valueKey,template.matchKey);
                            var ele=$(element).find("option[value="+_v.catelog+_v.valueId+"]");
                            //console.log($(element).html());
                            //console.log(ele);
                            ele.prop('selected',true);
                            //console.log('value-format',template.displayFormat);
                            if(template.displayFormat!=undefined){
                                var displayFormat=template.displayFormat;
                                $.each(_v,(kk,vv)=>{
                                    //console.log(kk+"----displayFormat--->"+(item.displayFormat.indexOf(kk)>-1));
                                    if(displayFormat.indexOf(kk)>-1){
                                        displayFormat=displayFormat.replace("{"+kk+"}",vv);
                                    }
                                })
                                
                            
                                _values.push(displayFormat);
                                
                            }else{
                                _values.push(ele.text()+"("+_v.status+")");
                            }
                            _valueData.push(_v);
                        });

                    }
                    
                }else{
                    var ele=$(element).find("option[value='无0']");
                        if(ele.length>0){
                            ele.prop('selected',true);
                            _values.push(ele.text());
                            _valueData.push({
                                status:"无",
                                statusId:0,
                                value:ele.text(),
                                valueId:ele.val(),
                                catelog:"",
                                catelogId:0
                            })
                        }
                }
                console.log('setSuperValue',_valueData);
                setSuperValue("#"+id,_valueData,$(element).parent().parent().jqmData('optionKey'));
                //console.log('value-format',_values);
                _self.find("#_"+id).html(_values.join("<br/>"));
                //element.selectmenu().selectmenu("refresh").trigger("change");
            }else if(type=="supermultiinput"){
                //var _values=[];
                //var _valueData=[];
                console.log("form setvalue",value);
                superMultiSelectSetDatas(id,value.split(','));
                var _values=_setSuperLabel(id,'{value} ({status})');
                //console.log("form setvalue",_values.join("<br/>"));
                _self.find("#_"+id).html(_values.join("<br/>"));
                //console.log("form setvalue",_self.find("#_"+id));
                //console.log("form setvalue",_self.find("#_"+id).text());
            }else if(type=="combobox"){
                
                if(value=="") value=0;
                var ele=$(element).find("option[value="+value+"]");
                ele.prop('selected',true);
                if(ele.length>0)
                    _self.find("#_"+id).text(ele.text());
                element.selectmenu().selectmenu("refresh").trigger("change");
            }else if(type=="textrange"){
                
                console.log(_self.find('#'+id+"_0"),_self.find('#'+id+"_1"));
                _self.find('#'+id+"_0").val('');
                _self.find('#'+id+"_1").val('');
                _self.find("#_"+id).text(value);
            }else if(type=="date"||type=="datetime"||type=="time")  {
                
                if(value!='0000-00-00 00:00:00' && value!='0000-00-00' && value!='00:00:00'){
                    if(value=="") value=new Date();
                    //console.log("form date",formatDateTime(new Date(value),"yyyy-MM-dd"),getDateTime(value));
                    element.val(formatDateTime(new Date(value),"yyyy-MM-dd"));
                    _self.find("#_"+id).text(formatDateTime(new Date(value),"yyyy年MM月dd日"));
                }else{
                    console.log('Date mform',value);
                    element.val('');
                    _self.find("#_"+id).text('');
                }
                
            }else{
                element.val(value);
                _self.find("#_"+id).text(value);
            }
        }else{
            if(type=="textrange"){
                
                //console.log(_self.find('#'+id+"_0"),_self.find('#'+id+"_1"));
                _self.find('#'+id+"_0").val('');
                _self.find('#'+id+"_1").val('');
                _self.find("#_"+id).text(value);
            }
        }
    },
    getValues:function(dataId,template,response){
        
        if(template==undefined) template=this.template;
        var _Self=$(this);
        const values={"id":dataId};
        var vals={};
        var catelogs=Object.keys(template);
        var _hasError=false;
        loop1:
        for(var catelog_key of catelogs){
            var catelog=template[catelog_key];
            //console.log("form get value",catelog);
            if(catelog.data!=undefined && Object.keys(catelog.data).length>0 && !catelog.hasOwnProperty('type')){
                var catelog_item_keys=Object.keys(catelog.data);
                loop2:
                for(var item_key of catelog_item_keys){
                    
                
                    
                    //form_item_ids[item_key]=catelog.data[item_key];
                    var hasError=false;
                    if(catelog.data[item_key].type.toLowerCase()=='radio'){
                        //console.log(item_key);
                        //console.log(_Self.find('input[name="'+item_key+'"]:checked'));
                        var val=_Self.find('input[name="'+item_key+'"]:checked').val();
                        if(catelog.data[item_key].table!=undefined){
                            if(!vals.hasOwnProperty(catelog.data[item_key].table)){
                                vals[catelog.data[item_key].table]={};
                            }
                            vals[catelog.data[item_key].table][item_key]=val;
                        }else{
                            values[item_key]=val;
                        }
                        
                    }else{
                        //console.log(catelog.data[item_key].type);
                        if(catelog.data[item_key].type.toLowerCase()=="textrange"){
                            for(var idx=0;idx<2;idx++){
                                var element=document.getElementById(item_key+"_"+idx);
                                var val = dataValidation(element,catelog.data[item_key],function(he){
                                    if(he) {
                                        response(error.FORM_EMPTY_VALUE,{data:values,success:!he,key:item_key});
                                        _hasError=true;
                                        hasError=true;
                                        return;
                                    }
                                    //console.log(item_key+"-->"+hasError);
                                });
                                console.log(item_key+"--->>"+catelog.data[item_key].table);
                                if(catelog.data[item_key].table!=undefined){
                                    if(!vals.hasOwnProperty(catelog.data[item_key].table)){
                                        vals[catelog.data[item_key].table]={};
                                    }
                                    if(vals[catelog.data[item_key].table][item_key]!=undefined){
                                        vals[catelog.data[item_key].table][item_key]+=","+val;
                                    }else{
                                        vals[catelog.data[item_key].table][item_key]=val;
                                    }
                                    
                                }else{
                                    if(values[item_key]!=undefined){
                                        values[item_key]+=","+val;
                                    }else{
                                        values[item_key]=val;
                                    }
                                }
                            }
                        }else if(catelog.data[item_key].type.toLowerCase()=="custom"){

                        }else{
                            var element=document.getElementById(item_key);
                            var val = dataValidation(element,catelog.data[item_key],function(he){
                                if(he) {
                                    response(error.FORM_EMPTY_VALUE,{data:values,success:!he,key:item_key});
                                    _hasError=true;
                                    hasError=true;
                                    return;
                                }
                                //console.log(item_key+"-->"+hasError);
                            });
                            console.log(item_key+"--->>"+catelog.data[item_key].table);
                            if(catelog.data[item_key].table!=undefined){
                                if(!vals.hasOwnProperty(catelog.data[item_key].table)){
                                    vals[catelog.data[item_key].table]={};
                                }
                                vals[catelog.data[item_key].table][item_key]=val;
                            }else{
                                values[item_key]=val;
                            }
                        }
                        
                    }
                    console.log(item_key+"-->"+hasError);
                    if(hasError) {
                        break loop1;
                    }
                };
            }else{
                if(catelog.type.toLowerCase()=='radio'){
                    //console.log(item_key);
                    //console.log(_Self.find('input[name="'+item_key+'"]:checked'));
                    var val=parseInt(_Self.find('input[name="'+catelog_key+'"]:checked').prop('id').replace(catelog_key+"-",""));
                    if(catelog.table!=undefined){
                        if(!vals.hasOwnProperty(catelog.table)){
                            vals[catelog.table]={};
                        }
                        vals[catelog.table][catelog_key]=val;
                    }else{
                        values[catelog_key]=val;
                    }
                    
                }else{
                    
                    if(catelog.type.toLowerCase()=="textrange"){
                        for(var idx=0;idx<2;idx++){
                            var element=document.getElementById(catelog_key+"_"+idx);
                            var val = dataValidation(element,catelog,function(he){
                                if(he) {
                                    response(error.FORM_EMPTY_VALUE,{data:values,success:!he,key:catelog_key});
                                    _hasError=true;
                                    hasError=true;
                                    return;
                                }
                                //console.log(item_key+"-->"+hasError);
                            });
                            console.log(catelog_key+"--->>"+catelog.table);
                            if(catelog.table!=undefined){
                                if(!vals.hasOwnProperty(catelog.table)){
                                    vals[catelog.table]={};
                                }
                                if(vals[catelog.table][catelog_key]!=undefined){
                                    vals[catelog.table][catelog_key]+=","+val;
                                }else{
                                    vals[catelog.table][catelog_key]=val;
                                }
                            }else{
                                if(values[catelog_key]!=undefined){
                                    values[catelog_key]+=","+val;
                                }else{
                                    values[catelog_key]=val;
                                }
                            }
                        }
                    }else if(catelog.type.toLowerCase()=="custom"){

                    }else{
                        var element=document.getElementById(catelog_key);
                        var val = dataValidation(element,catelog,function(he){
                            if(he) {
                                response(error.FORM_EMPTY_VALUE,{data:values,success:!he,key:item_key});
                                _hasError=true;
                                hasError=true;
                                return;
                            }
                            //console.log(item_key+"-->"+hasError);
                        });
                        console.log(catelog_key+"--->>"+catelog.table);
                        if(catelog.table!=undefined){
                            if(!vals.hasOwnProperty(catelog.table)){
                                vals[catelog.table]={};
                            }
                            vals[catelog.table][catelog_key]=val;
                        }else{
                            values[catelog_key]=val;
                        }
                    }
                }
                console.log(catelog_key+"-->"+hasError);
                if(hasError) {
                    break loop1;
                }
            }
            //if(_hasError) return false;
        };
        /*
        values["caseCreateDate"]=getDateTime();
        //console.log("currentUser......"+sessionStorage.getItem("currentUser"));
        if(getGlobal("currentUser")==null || getGlobal("currentUser")==undefined){
            console.log("currentUser-- has error value");
            response(error.FORM_INVALID_USER,values);
            return;
        }else{
            values["caseApplicant"]=JSON.parse(getGlobal("currentUser")).id;
        }
        */
        //response(hasError,values);
        vals.values=values;
        response(error.FORM_VALIDATION_COMPLETED,{data:vals,success:!_hasError});
        function dataValidation(element,itemTemplate,res){
            console.log(itemTemplate);
            var hasError=false;
            var val=element.value;
            //$('#popupArrow').css({'margin-top':'20px;'})
            switch (element.nodeName.toUpperCase()){
                case "INPUT":
                    //console.log(itemTemplate.numberOnly,val,isNumber(val));
                    //console.log(element.type);
                    if(element.type.toLowerCase()=="date"||element.type.toLowerCase()=="time"||element.type.toLowerCase()=="datetime"){
                        if(val.length>0){
                            val=new Date(val).toISOString().slice(0, 19).replace('T', ' ');
                        }else{
                            if(!itemTemplate.isOptional) {
                                console.log(itemTemplate.label+"-- has empty value");
                                hasError=true;
                            }else{
                                if(element.type.toLowerCase()=="datetime")
                                    val=formatDateTimeStr2Mysql('0000-00-00 00:00:00');
                                else if(element.type.toLowerCase()=="date")
                                    val=formatDateTimeStr2Mysql('0000-00-00');
                                else if(element.type.toLowerCase()=="time")
                                    val=formatDateTimeStr2Mysql('00:00:00');
                            }
                        }
                        //console.log('Date mform getvalue',val);
                        
                    }else if(itemTemplate.numberOnly){
                        
                        if(!isNumber(val)||val.length===0) {
                            //console.log(itemTemplate.label+"-- has error value"+val);
                            hasError=true;
                        }
                        if(eval.length==0) val=0;
                        else val=parseInt(val);
                    }else if(element.type.toLowerCase()=="file"){
                        val=$(element).prop('files');
                    }
                    if(val.length===0 && !itemTemplate.isOptional){
                        console.log(itemTemplate.label+"-- has error value"+val);
                        hasError=true;
                    }
                    //console.log(element.id,hasError,val.length,itemTemplate.isOptional)
                    res(hasError);
                    break;
                case "SELECT":
                    var _val=[];
                    var _subVal=[];
                    var _greatVal=[];
                    //console.log(itemTemplate.label+"-->"+$(element).find(":selected").length);
                    if($(element).hasClass('supermultiInput')){
                        _greatVal=_getSuperValue($(element).attr('id'),'{statusId}{value}')
                        _val=_greatVal;
                    }else{
                        $.each($(element).find(":selected"),function(index,opt){
                            //console.log(itemTemplate.label+"--------->"+opt.value,$(element).val());
                            _val.push(opt.value);
                            _subVal.push($(opt).jqmData('statusValue'));
                            _greatVal.push(($(opt).jqmData('statusValue')==undefined?"":$(opt).jqmData('statusValue'))+opt.value);
                        });
                        
                    }
                    if((_val.length==0 || _val=="无") && !itemTemplate.isOptional) {
                        //console.log("form valiation 值为空或无");
                        console.log(itemTemplate.label+"-- has empty value"+_val.join(","));
                        hasError=true;
                    }else{

                        //console.log("combobox check...",_val,(itemTemplate.data!=undefined),(itemTemplate.isValueCanNotBeNone));
                        if(itemTemplate.data!=undefined && !itemTemplate.isValueCanBeNone && !itemTemplate.isOptional){
                            //console.log("combobox check...",_val,$.grep(_val,(v)=>itemTemplate.data[v]=="无").length)
                            if(_val instanceof Array){
                                //console.log("form valiation 值是 array",{template:itemTemplate});
                                if(itemTemplate.matchKey!=undefined && itemTemplate.valueKey!=undefined){

                                    var matched=$.grep(itemTemplate.data,(d=>_val.includes(d[itemTemplate.valueKey].toString())));
                                    //console.log("form valiation",matched);
                                    //console.log("form valiation 有matchkey和valuekey",matched);
                                    
                                    if(matched.length>0 && matched[0][itemTemplate.matchKey]=="无"){
                                        console.log(itemTemplate.label+"-- has empty value"+_val.join(","));
                                        hasError=true;
                                    }
                                    
                                }else{
                                    if($.grep(_val,(v)=>itemTemplate.data[v]=="无").length>0){
                                        console.log(itemTemplate.label+"-- has empty value"+_val.join(","));
                                        hasError=true;
                                    }
                                }
                                
                            }
                            
                        }
                    }
                    
                    //console.log(itemTemplate.label,_subVal);
                    //console.log(itemTemplate.label,_val);
                    //console.log(itemTemplate.label,_greatVal);
                    if(itemTemplate.hasOwnProperty('valueKey') && !$(element).hasClass('supermultiInput') && !$(element).hasClass('supermultiSelect')){
                        var _v=[];
                        if(itemTemplate.valueKey=="*"){
                            $.each(_val,(i,v)=>{
                                //console.log('itemTemplate.valueKey',v)
                                if(itemTemplate.data instanceof Array){
                                    _v.push(itemTemplate.data[parseInt(v)]);
                                }else{
                                    _v.push(itemTemplate.data[v]);
                                }
                               
                            });
                            val=_v.join(",");
                        }else{
                            //console.log(_val);
                            if(_val instanceof Array){
                                val=_val.join(",");
                            }else{
                                $.each(_val,(i,v)=>{
                                    //console.log("has valueKey",itemTemplate.data,v,_val);
                                    //console.log("has valueKey1",itemTemplate.data.find(d=>d[itemTemplate.valueKey]==v));
                                    //$.grep(itemTemplate.data,(d=>d[itemTemplate.valueKey].toString())==v.toString());
                                    _v.push(itemTemplate.data.find(d=>d[itemTemplate.valueKey]==v)[itemTemplate.valueKey]);
                                });
                                //console.log("has valueKey2",_v);
                                val=_v.join(",");
                            }
                            
                        }
                        
                    }else{
                        val=_greatVal.join(",");
                    }
                    res(hasError);
                    break;
                case "TEXTAREA":
                    if(val.length===0 && !itemTemplate.isOptional){
                        console.log(itemTemplate.label+"-- has error value"+val);
                        hasError=true;
                    }
                    res(hasError);
                    break;
            }
            if(hasError) {
                var tooltip=$('<span class="tooltip-serarch">'+$(element).jqmData('message')+'</span>');
                _Self.find('.tooltip-serarch').remove();
                _Self.append(tooltip);
                //console.log($(element).position(),$(element).offset(),$(element).offsetParent().hasClass('ui-popup'));
                var position=$(element).offsetParent().hasClass('ui-popup')?$(element).position():$(element).offset();
                $(tooltip).css({visibility: 'visible',
                    opacity: 1,'margin-left':"0px",
                    padding: '5px',
                    left:position.left,
                    top:(position.top+$(element).height()+10)+'px'});
                $(element).on('click',function(e){
                    $(tooltip).remove();
                })
                    /*
                $('#popupArrow').popup().popup('open',{
                    positionTo: "#"+element.id,
                    arrow:"true"
                });
                $('#popupArrow').text($(element).jqmData('message'));
                */
            }
            return val;
            
        }
    }

});