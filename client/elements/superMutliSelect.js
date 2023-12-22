var casePersonnelStatus=['无','原告','被告','被执行人','申请执行人','上诉人','原审被告'];
var value_format="{value} ({status})";
//#region superMultiSelectWithInput
function superMultiSelectSetDatas(elementId,datas){//2中国人寿,3中国银行
    //console.log('superMultiSelectSetDatas',datas);
    var listbox=$('#'+elementId+'-menu');
    //console.log('listbox',listbox);
    listbox.empty();
    $.each(datas,(index,data)=>{
        var fdata=formatSuperMultiSelectData(data);
        listbox.append(superMultiSelectRowItem(listbox,index,'{value} ({status})',fdata,index<datas.length-1));
    })
    _setSuperLabel(elementId,'{value} ({status})');
    listbox.trigger('create');
}
function _setSuperLabel(elementid,format){//"[{catelog}] {value} ({status})"
    var collector=[];
    elementid=elementid.replace('#','');
    
    //console.log('setSuperMultiselect setSuperLabel format',format);
    var datas=_getSuperValue(elementid);
    //console.log('formatSuperValue datas',datas);
   if(datas==undefined) return;
    datas.forEach((data)=>{
        var label=format;
        var value=data.value;
        var status=data.status;
        if(format!=undefined){
            if(label.indexOf('{value}')>-1) label=label.replace('{value}',value);
            if(label.indexOf('{status}')>-1) label=label.replace('{status}',status);
        }else{
            label=`${data.value} (${data.status})`;
        }
        //console.log('formatSuperValue data',data);
        
        //console.log('formatSuperValue format',label);
        collector.push(label);
    });
    //console.log('formatSuperValue values',collector)
    if(collector.length>0){
        $('#'+elementid+'-button').find('span').first().text(collector.join(','));
        $('#'+elementid+'-button').find('span').last().text(collector.length);
        if(collector.length>1) $('#'+elementid+'-button').find('span').last().show();
        else $('#'+elementid+'-button').find('span').last().hide();
    }else{
        $('#'+elementid+'-button').find('span').first().html('&nbsp;');
        $('#'+elementid+'-button').find('span').last().text(collector.length);
        $('#'+elementid+'-button').find('span').last().hide();
    }
    return collector;
}
function superMultiSelectRowItem(listbox,idx,format,data,notLast){
    //console.log("superMultiSelectRowItem",data);

    var li=$('<li data-option-index="'+idx+'" data-icon="false" class="" role="option" aria-selected="true"></li>');
    var controlgroup=$('<div data-option-index="'+idx+'" data-role="controlgroup" class="row-controlgroup" data-type="horizontal")></div>');
    var select=$('<select class="sub-selectmenu" data-corners="false"></select>');
    $.each(casePersonnelStatus,(index,status)=>{
        var opt=$('<option class="sub-option" value='+index+'>'+status+'</option>');
        if(data!=undefined) {
            if(data.statusId==index) opt=$('<option class="sub-option" value='+index+' selected>'+status+'</option>');
        }
        select.append(opt);
    })
    var input=$('<input id="mutliselect-input-0" type="text" data-wrapper-class="controlgroup-textinput ui-btn">')
    if(data!=undefined) {
        input.val(data.value);
    }
    var button=$('<button data-option-index="'+idx+'" class="ui-btn ui-btn-icon-notext ui-icon-plus btn-icon-green">添加</button>')
    if(notLast){
        button=$('<button data-option-index="'+idx+'" class="ui-btn ui-btn-icon-notext ui-icon-delete btn-icon-red">删除</button>')
    }
    
    controlgroup.append(select);
    controlgroup.append(input);
    controlgroup.append(button);
    li.append(controlgroup);
    select.change(function () {
        var elementId=listbox.attr('id').replace('-menu','');
        _setSuperLabel(elementId,format);
        $('#'+elementId).trigger('selectChange');
    });
    button.on('click',function(e){
        var id=$(this).jqmData('option-index');
        //console.log(id);
        var elementId=listbox.attr('id').replace('-menu','');
        if($(this).hasClass('ui-icon-plus')){
            //打印到selectbutton
            
            
            //添加新的一行
            listbox.append(superMultiSelectRowItem(listbox,(id+1)));
            listbox.trigger('create').listview().listview( "refresh" );
            $(this).removeClass('ui-icon-plus').addClass('ui-icon-delete');
            $(this).removeClass('btn-icon-green').addClass('btn-icon-red');
        }else{
            listbox.find('div[data-option-index="'+id+'"]').remove();
        }
        _setSuperLabel(elementId,format);

        $('#'+elementId).trigger('selectChange');
    });
    return li;
}

function _getSuperValue(elementid,format){

    //console.log('formatSuperValue elementId',elementid);
    var listbox_popup=$('#'+elementid.replace('#','')+'-listbox');
    var values=[];

    //console.log("formatSuperValue listbox_popup",listbox_popup);
    $.each(listbox_popup.find('div[data-role="controlgroup"]'),function(i,cg){
        var input=$(cg).find('input');
        
        var select=$(cg).find('select > option:selected');
        //console.log("getValue input",$(select));
        if($(input).val().length>0){
            if(format!=undefined){
                var label=format;
                if(label.indexOf('{value}')>-1) label=label.replace('{value}',$(input).val());
                if(label.indexOf('{status}')>-1) label=label.replace('{status}',select.text());
                if(label.indexOf('{statusId}')>-1) label=label.replace('{statusId}',select.val());
                values.push(label);
            }else{
                values.push({
                    status:select.text(),
                    statusId:select.val(),
                    value:$(input).val(),
                });
            }
            
        }
    });
    //console.log("formatSuperValue values",values);
    return values;
//button_span.find('span').text(datas.join(','));

}
function _isReadOnlyCurrentForm(){
    var datas=DataList.combinedData.filter(d=>d.id==getGlobal("currentId"));
    if(datas.length>0)
        return datas[0].isReadOnly;
    return true;
}
function formatSuperMultiSelectData(data){
    var statusid=0;
    var value="";
    if(!isNaN(parseInt(data[0]))){//我方当事人状态
        statusid=Number(data[0]);
        value=data.substring(1, data.length);
    }
    return {
        status:casePersonnelStatus[statusid],
        statusId:statusid,
        value:value,
    };
}
//#endregion SuperMultiselectWithInput

function setSuperValue(element,values,vformat){
    //console.log('setSuperMultiselect setSuperValue format',vformat);
    if(vformat==undefined) vformat=value_format;
    //console.log('setSuperValue value',values);
    if(values==undefined) return;
    setSuperLabel(values,element,vformat);
    var listbox_popup=$(element+'-listbox');
    var li=listbox_popup.find('li').not('.ui-li-divider');
    $(li).attr("aria-selected" , false);
    var selects=$(li).find('select');
    $(element).find('option').jqmData('statusValue',0);
    selects.prop('disabled',true);
    var a=li.find('div > a');
    //console.log('setSuperValue a',li.find('div > a'));
    a.removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
    var selected=[];
    values.forEach(value=>{
        $.each(li,(index,_li)=>{
            var a_=$(_li).find('div > a');
            var select_=$(_li).find('div > select');
            
           // console.log('setSuperValue _li',$(_li).html());
            //console.log('setSuperValue select_',select_.find('option[value='+value.statusId+']'));
            var mached = $.grep(a_,(_a)=> value.value==$(_a).text());
            //console.log('setSuperValue',select_.find('option'));
            select_.find('option').prop('selected',false);
            //console.log('setSuperValue opt',select_.find('option'));
            $(mached).removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
            if(mached.length>0){
                //console.log('select_',select_);
                $(_li).attr("aria-selected" , true);
                select_.prop('disabled',false);
                //select_.find('option[value="'+value.statusId+'"]').prop('selected',true);
                //console.log('setSuperValue option',select_.find('option[value="'+value.statusId+'"]'));
                //console.log('setSuperValue option is selected',select_.find('option[value="'+value.statusId+'"]').prop('selected'));
                selected.push(select_.find('option[value="'+value.statusId+'"]'));
            }else{
                
            }
            select_.selectmenu().selectmenu("refresh");
        });
        //console.log('setSuperValue',value.catelog+value.valueId);
        $(element).find('option[value="'+value.catelog+value.valueId+'"]').jqmData('statusValue',value.statusId);
        

    })
    //console.log('setSuperValue selected',selected);
    selected.forEach((s)=>{
        $(s).prop('selected',true);
        $(s).parent().selectmenu().selectmenu("refresh");
    })
}
function formatSuperMultiSelectOptionValue(value,valueKey,matchKey){
        var splited=value.split('');//'3个人0'----3:statusId, 个人:catelog, 0:valueId
        var statusid=0;
        var catelogid=0;
        var valueid=0;
        var catelog=[];
        
        //console.log('formatSuperMultiSelectOptionValue Number',!isNaN(parseInt(splited[0])))
        if(!isNaN(parseInt(splited[0]))){//我方当事人状态
            statusid=Number(splited[0]);
            for(var i=1;i<3;i++){
                catelog.push(splited[i]);
            }
            valueid=Number(value.replace(statusid+catelog.join(''),''));
            //console.log(statusid+catelog.join(''),valueid);
        }else{
            for(var i=0;i<2;i++){
                catelog.push(splited[i]);
            }
            valueid=Number(value.replace(catelog.join(''),''));
            //console.log(catelog.join(''),valueid);
        }
        //if(!isNaN(parseInt(splited[0]))){//我方当事人id
            //valueid=Number(splited[splited.length-1]);
        //}
        
        catelogid=Object.keys(casePersonnel).indexOf(catelog.join(''));
        //console.log('formatSuperMultiSelectOptionValue value',value)
        //console.log('formatSuperMultiSelectOptionValue catelog',catelog.join(''))
        //console.log('formatSuperMultiSelectOptionValue casePersonnel',casePersonnel[catelog.join('')])
        //console.log('formatSuperMultiSelectOptionValue',casePersonnel,catelog.join(''),valueKey,matchKey)
        var value=$.grep(casePersonnel[catelog.join('')],(v)=>v[(matchKey!=undefined?matchKey:'id')]==valueid);
        if(value.length>0) value=value[0][(valueKey!=undefined?valueKey:'name')];
        //if(value.length>0) value=value[0].name;
        /*
        console.log('formatSuperMultiSelectOptionValue',{
            status:casePersonnelStatus[statusid],
            statusId:statusid,
            value:value,
            valueId:valueid,
            catelog:catelog.join(''),
            catelogId:catelogid
        });
        */
        return {
            status:casePersonnelStatus[statusid],
            statusId:statusid,
            value:value,
            valueId:valueid,
            catelog:catelog.join(''),
            catelogId:catelogid
        }
}
function getSuperValue(element){

    var id=$(element).attr('id');
    var listbox_popup=$('#'+id+'-listbox');
    var button_span=$('#'+id+'-button')
    //var datas=[];
    var values=[];
    $.each(listbox_popup.find('li[aria-selected="true"]'),function(i,l){
        //console.log($(l).find('select').val());
        //console.log("getValue i",i);
        //console.log("getValue l",l);
        var index=$(l).jqmData('option-index');
        var subOptVal=$(l).find('select').val();
        var subOpt=$(l).find('select > option:selected').text();
        $.each($(element).find('option'),function(ii,opt){
            if(index==ii) {
                //datas.push("("+subOpt+") "+$(opt).text())
                values.push({
                    status:subOpt,
                    statusId:subOptVal,
                    value:$(opt).text(),
                    valueId:$(opt).val(),
                    catelog:$(l).jqmData('group'),
                    catelogId:$(l).jqmData('group-id')
                });
                //if(isSetData2MainSelect) $(opt)
            }
        });
    });
    //console.log("getValue values",values);
    return values;
    //button_span.find('span').text(datas.join(','));

}
function formatSuperValue(element,format){//"[{catelog}] {value} ({status})"
    //console.log('formatSuperValue setSuperLabel format',format);
    setSuperLabel(getSuperValue($(element)),element,format);
}
function setSuperLabel(datas,element,format){
    var collector=[];
    //console.log('setSuperMultiselect setSuperLabel format',format);
   if(datas==undefined) return;
    datas.forEach((data)=>{
        var label=format;
        var catelog=data.catelog;
        var value=data.value;
        var status=data.status;
        if(format!=undefined){
            if(label.indexOf('{catelog}')>-1) label=label.replace('{catelog}',catelog);
            if(label.indexOf('{value}')>-1) label=label.replace('{value}',value);
            if(label.indexOf('{status}')>-1) label=label.replace('{status}',status);
        }else{
            label=`[${data.catelog}] ${data.value} (${data.status})`;
        }
        //console.log('formatSuperValue data',data);
        
        //console.log('formatSuperValue format',label);
        collector.push(label);
    });
    //console.log('formatSuperValue values',collector)
    if(collector.length>0){
        $(element+'-button').find('span').first().text(collector.join(','));
        $(element+'-button').find('span').last().text(collector.length);
        if(collector.length>1){
            $(element+'-button').find('span').last().show();
        }else{
            $(element+'-button').find('span').last().hide();
        }
    }else{
        $(element+'-button').find('span').first().html('&nbsp;');
        $(element+'-button').find('span').last().text(collector.length);
        $(element+'-button').find('span').last().hide();
    }
}
function checkIfMainSelectChecked(element,id4check){
    var val=false;
    $.each($(element).find('option'),function(ii,opt){
        //console.log($(opt).text()+"-->"+ii+"=="+id4check+"---"+$(opt).prop('selected'))
        if($(opt).prop('selected') && ii==id4check) {
            val=true;
            return false;
        }
    });
    return val;
}

initalList=[];
$.fn.extend({
    setSuperMultiselect:function(){
        //$(document).on("pagecreate", function () {
        var self=this;
        var id=$(self).attr('id');
        var listbox_popup=$('#'+id+'-listbox')
        //console.log('setSuperMultiselect format',vformat);
        //console.log('setSuperMultiselect before html',$('#'+id+'-menu').html());
        //$(self).parent().parent().find('.sub-selectmenu').remove();//去除自动生成的多余select元素
        
        $(this).parent().parent().find('.sub-selectmenu').remove();
        var displayformat=$(self).data('displayformat');
        var optionformat=$(self).data('optionformat');
        //console.log('select data',displayformat,optionformat,$(self));
        setSuperValue('#'+id,undefined,optionformat);
        //console.log('setSuperMultiselect',id);
        //console.log('listbox',listbox);
        listbox_popup.popup({
            afterclose: function( event, ui ) {
                //console.log("closed");
                //console.log("listbox html"+listbox.html());
                var datas=getSuperValue($(self));
                
                //console.log("listbox html"+listbox.html());
                var options=$(self).find('option');
                options.prop('selected',false);
                datas.forEach((data)=>{
                    $.each(options,function(ii,opt){
                        if(data.valueId==$(opt).val()) {
                            $(opt).prop('selected',true);
                            $(opt).jqmData('statusValue',data.statusId);
                            //console.log($(opt));
                        }
                    });
                });
                //console.log("setSuperMultiselect parent",$(self).parent().parent().html());
                
            },
            afteropen: function( event, ui ) {
                /*
                $(self).filterable({
                    input: $(listbox).find("form > div > input"),
                    children: "> optgroup option[value]"
                })
                */
            }
        });
        //console.log(_this.html());
        
        var search_form=$(listbox_popup).find("form");
        search_form.find('div > input').attr('id',id+"-search");
        //var title=$(listbox).find('.ui-header.ui-bar-inherit');
        //aList.find('li').remove();
        var listbox = listbox_popup.find("ul")
        var aList=$(listbox).find("li");
        
        listbox.remove();
        listbox=$('<ul class="ui-selectmenu-list ui-listview ui-super-listview" id="'+id+'-menu" role="listbox" aria-labelledby="'+id+'-button" data-filter="true" data-input="#'+id+'-search"></ul>');
        listbox_popup.append(listbox);
        //listbox.append(title);
        //listbox.append(search);
        //listbox.jqmData('input','#'+id+"-search");
        //listbox.jqmData('filter',"true");
        
        var count=0;
        var catelog_count=-1;
        var catelog="";
        //console.log('aList',aList);
        aList.each(function () {
            var listItem = $(this);
            //console.log('aList',listItem.html());
            if(listItem.hasClass('ui-li-divider')){
                listbox.append(listItem);
                catelog=listItem.text();
                catelog_count++;
            }else{
                var a=listItem.find('a');
                var li=$('<li data-option-index="'+count+'" data-group="'+catelog+'" data-group-id="'+catelog_count+'" data-icon="false" class="" role="option" aria-selected="'+checkIfMainSelectChecked('#'+id,count)+'"></li>');
                var controlgroup=$('<div class="ui-controlgroup ui-m-controlgroup" ></div>');
                var select=$('<select data-option-index="'+count+'" class="sub-selectmenu" data-corners="false"></select>');
                casePersonnelStatus.forEach((s,idx)=>{
                    var opt=$('<option class="sub-option" value='+idx+(idx==0?" selected":"")+'>'+s+'</option>');
                    select.append(opt);
                })
                controlgroup.append(select);
                
                select.trigger('create').selectmenu().selectmenu('refresh');
                controlgroup.append(a);
                if(checkIfMainSelectChecked('#'+id,count)){
                    $(a).removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
                    select.prop('disabled',false);
                }else{
                    $(a).removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
                    select.prop('disabled',true);
                }
                li.append(controlgroup);
                //console.log('listbox',listbox.html())
                listbox.append(li);
                a.on('click',function(e){
                   
                   //_this.trigger('create').listview().listview( "refresh" );
                   $(self).selectmenu().trigger('create');
                   //console.log(li.attr("aria-selected"));
                    //$('#multiselect-button > span').text();
                    if($(this).hasClass('ui-checkbox-on')){
                        $(this).removeClass('ui-checkbox-on').addClass('ui-checkbox-off');
                        li.attr("aria-selected" , false);

                        select.prop('disabled',true);
                    }else{
                        $(this).removeClass('ui-checkbox-off').addClass('ui-checkbox-on');
                        select.prop('disabled',false);
                        li.attr("aria-selected" , true);
                    }
                    //console.log($('#multiselect').find(':selected').text().join(","));
                    formatSuperValue('#'+id,displayformat);
                    
                })
                select.change(function () {
                    var optionSelected = $(this).find('option:selected');
                    //var optTextSelected = optionSelected.text();
                    var optValueSelected = optionSelected.val();
                    //console.log(listbox.find('li[data-option-index="'+$(this).jqmData('option-index')+'"]'));
                    if(listbox.find('li[data-option-index="'+$(this).jqmData('option-index')+'"]').attr('aria-selected')){
                        formatSuperValue('#'+id,displayformat);
                    }
                    //console.log(optValueSelected);
                });
                count++;
            }
            
        });
        listbox.attr("aria-labelledby" ,id+"-button");
        formatSuperValue('#'+id,displayformat);
        listbox.trigger('create').listview().listview( "refresh" );
        //console.log(listbox.html());
        
        //console.log('setSuperMultiselect after html',$(listbox_popup).html());
        $(self).trigger('create');
        
//});
    },
    setSuperMultiselectA:function(vformat){
        if (vformat==undefined) vformat='{value} ({status})';
        var elementId=$(this).attr('id');
        //console.log('listbox',elementId);
        $(this).parent().parent().find('.sub-selectmenu').remove();
        //$('#'+elementId+'-button').find('.sub-selectmenu').remove();
        //setSuperValue('#'+elementId,undefined,vformat);
        //if(initalList.includes(elementId)) return;
        //initalList.push(elementId);
        var listbox_popup=$('#'+elementId+'-listbox');
        listbox_popup.popup({
            afterclose: function( event, ui ) {
                _setSuperLabel(elementId,vformat);
                
                $('#'+elementId).trigger('selectChange');
            }
        });
        var search_form=$(listbox_popup).find("form");
        search_form.find('div > input').attr('id',elementId+"-search");
        //var title=$(listbox).find('.ui-header.ui-bar-inherit');
        //aList.find('li').remove();
        var listbox = listbox_popup.find("ul")
        //var aList=$(listbox).find("li");
        
        listbox.remove();
        listbox=$('<ul class="ui-selectmenu-list ui-listview ui-super-listview" id="'+elementId+'-menu" role="listbox" aria-labelledby="'+elementId+'-button" data-filter="true" data-input="#'+elementId+'-search"></ul>');
        listbox_popup.append(listbox);
        var li=$('<li data-option-index="0" data-icon="false" role="option" ></li>');
        
        //li.append(controlgroup);
        
        //setTimeout(() => {
            
        listbox.append(superMultiSelectRowItem(listbox,0,vformat,_getSuperValue(elementId,vformat)));
        listbox.trigger('create').listview().listview( "refresh" );
        //}, 500);
        //console.log('listbox',listbox_popup.html());
        
        

    }
    
});
