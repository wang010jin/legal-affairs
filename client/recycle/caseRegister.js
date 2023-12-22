

function _initRegTable(table_data,table_columns){
    //console.log("table created: "+table_data);
    const table = document.getElementById("table1");
    table.innerHTML=_getTableHTML(table_data,table_columns);
    $(table).table('refresh');
    $(table).trigger('create');
    
    //#region 操作按钮
    var fn_buts = document.querySelectorAll("button[name^=fn_btn]")
    fn_buts.forEach(function(fn_but) {
        fn_but.addEventListener('click', function(but) {

            console.log(but.currentTarget.dataset.item+"--"+but.currentTarget.name);
            //console.log(table_data[fn_but.dataset.item]);
            var matchItems=table_data.filter((item) =>item.id == but.currentTarget.dataset.item);
            var caseNos=[];
            matchItems.forEach(_item=>{
                caseNos.push(_item.caseNo);
            });
            if(but.currentTarget.name=="fn_btn_delete"){
                //console.log(table_data);
                SendMessage('提醒',"确认删除案件编号[ "+caseNos.join(',')+" ]吗？",function(e){
                    if(e.currentTarget.id=="message_confirm_but"){
                        if(matchItems.length>0){
                            table_data.splice(table_data.indexOf(matchItems[0]),1);
                        }
                        
                        _initRegTable(table_data,table_columns);
                        $(document.getElementById("table1")).trigger('create');
                    }
                    HideMessage();
                });
                
            }else if(but.currentTarget.name=="fn_btn_edit"){
                if(matchItems.length>0){
                    _showEditForm(matchItems[0]);//naviation.js
                }
                //console.log($("#popup_form_main"));
            }else if(but.currentTarget.name=="fn_btn_details"){
                if(matchItems.length>0){
                    _setFlowChart(table_progress_data,table_progress_status,table_progress_executes,table_progress_updates,matchItems[0].id);
                }
                //console.log($("#popup_form_main"));
            }
        
        })
    });
    var checkboxes = document.querySelectorAll("input[type=checkbox][name=item_checkbox]")
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {

            console.log(checkbox.dataset.item);

        
        })
    });

    var checkbox_main = document.querySelector(".reg-checkbox-all")
    checkbox_main.addEventListener('change', function() {

        console.log(document.querySelectorAll("input[type=checkbox][name=item_checkbox]:checked"));

    
    });
    //#endregion
}
function _getTableHTML(data,columnData){
    //if(data.length==0) return "";
    var keys=data.length==0?Object.keys(columnData):Object.keys(data[0]);
    var columns_keys=Object.keys(columnData);
    var hasHeaderSet=false;
    var table_body_str="";
    var body_row_str="";
    var body_str="";
    
    var function_buts='<div data-role="controlgroup" data-type="horizontal" data-mini="true">'+
                    '<button name="fn_btn_details" class="btn-icon-green" data-icon="eye" data-iconpos="notext" data-item={0}>查看</button>'+
                    '<button name="fn_btn_edit" class="btn-icon-blue" data-icon="edit" data-iconpos="notext" data-item={0}>修改</button>'+
                    '<button name="fn_btn_delete" class="btn-icon-red" data-icon="delete" data-iconpos="notext" data-item={0}>删除</button>'+
                '</div>';
    var offset=keys.length-columns_keys.length;
    let header_str="";
    columns_keys.forEach((column,counter)=>{
        var ws=column.width!=undefined?" style='width:"+column.width+"px;'":"";
            if(counter<2){
                if(counter==0){
                    header_str+=`<th${ws}><input class="reg-checkbox-all" type="checkbox" data-mini="true"></th>`;
                }
                header_str+=`<th${ws}>${columnData[column].label}</th>`;
            }else{
                header_str+=`<th${ws} data-priority="${counter-1}">${columnData[column].label}</th>`;
            }
            if (counter==keys.length-1-offset){
                header_str+=`<th${ws}>操作</th>`;
            }
        
    });
    table_body_str+='<thead><tr>'+header_str+'</thead></tr>';
    data.forEach((item)=>{
        body_row_str="";
        var counter=0;
        columns_keys.forEach((column)=>{
            console.log(column+"---"+keys.includes(column));
            console.log(columnData[column]);
            if(keys.includes(column)){
                
                if (counter==0){
                    body_row_str+=`<td><input class="reg-checkbox" type="checkbox" data-mini="true" name="item_checkbox" data-item=${item["id"]}></td>`;
                } 
                if(columnData[column].data){
                    if(column=="caseApplicant"){
                        console.log(columnData[column].data[parseInt(item[column])]);
                        body_row_str+=`<td>${columnData[column].data[parseInt(item[column])].name}</td>`;
                    }else
                        body_row_str+=`<td>${columnData[column].data[parseInt(item[column])]}</td>`;
                }else{
                    if(column=="caseCreateDate")
                        body_row_str+=`<td>${formatDateTime(new Date(item[column]),'yyyy年MM月dd日')}</td>`;
                    else if(column=="caseApplicant"){
                        console.log(parseInt(item[column]));
                        var user=getGlobalJson("userList").filter((user)=>user.id==parseInt(item[column]));
                        if(user.length>0)
                            body_row_str+=`<td>${user[0].name}</td>`;
                    }
                    else
                        body_row_str+=`<td>${item[column]}</td>`;
                }
                //console.log(keys);
                //console.log(counter+"=="+(keys.length-1));
                if (counter==keys.length-1-offset){
                    //console.log(formatString(function_buts,item["id"]));
                    body_row_str+=`<td>${formatString(function_buts,item["id"])}</td>`;
                }
                counter++;
            }
    
            
        }); 
        body_str+='<tr>'+body_row_str+'</tr>';
        counter=0;
    });
    table_body_str+='<tbody>'+body_str+'</tbody>';
    return table_body_str;
}


