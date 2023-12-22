
var table_data=[
    {id:1,caseNo:"A202311110005",caseName:"管文波离职案件",caseReason:"劳动争议纠纷",caseType:0,caseBelong:"北七家",applicant:"张国庆",createDate:"2023-11-11 14:03:19"},
    {id:2,caseNo:"A202311110004",caseName:"产品商标案件",caseReason:"行政诉讼",caseType:0,caseBelong:"北七家",applicant:"李晓霞",createDate:"2023-11-11 14:03:19"}
];
var table_columns={
id:"序号",
caseNo:"案件编号",
caseName:"案件名称",
caseReason:"案由",
caseType:"案件类型",
caseBelong:"所属项目",
applicant:"申请人",
createDate:"创建时间",
}

var keys=Object.keys(table_data[0]);
var columns_keys=Object.keys(table_columns);
var hasHeaderSet=false;
let table_body_str="";
let body_row_str="";
let body_str="";

let function_buts='<div data-role="controlgroup" data-type="horizontal" data-mini="true">'+
                '<button name="fn_btn_details" class="btn-icon-green" data-icon="eye" data-iconpos="notext" data-item={0}>查看</button>'+
                '<button name="fn_btn_edit" class="btn-icon-blue" data-icon="edit" data-iconpos="notext" data-item={0}>修改</button>'+
                '<button name="fn_btn_delete" class="btn-icon-red" data-icon="delete" data-iconpos="notext" data-item={0}>删除</button>'+
            '</div>';
table_data.forEach((item)=>{
    let header_str="";
    body_row_str="";
    let counter=0;
    columns_keys.forEach((column)=>{
        //console.log(column);
        
        if(keys.includes(column)){
            if(hasHeaderSet == false){
                if(counter<2){
                    if(counter==0){
                        header_str+=`<th><input type="checkbox" data-mini="true"></th>`;
                    }
                    header_str+=`<th>${table_columns[column]}</th>`;
                }else{
                    header_str+=`<th data-priority="${counter-1}">${table_columns[column]}</th>`;
                }
                if (counter==keys.length-1){
                    header_str+=`<th>操作</th>`;
                }
            }
            if (counter==0){
                body_row_str+=`<td><input type="checkbox" data-mini="true" name="item_checkbox" data-item=${item["id"]}></td>`;
            } 
            
            if(column=="caseType"){
                body_row_str+=`<td>${case_types[parseInt(item[column])]}</td>`;
            }else{
                body_row_str+=`<td>${item[column]}</td>`;
            }
            
            if (counter==keys.length-1){
                body_row_str+=`<td>${formatString(function_buts,item["id"])}</td>`;
            }
        }

        counter++;
    });  
    if (hasHeaderSet == false){
        hasHeaderSet=true;
        table_body_str+='<thead><tr>'+header_str+'</thead></tr>';
    }
    body_str+='<tr>'+body_row_str+'</tr>';
    counter=0;
});
table_body_str+='<tbody>'+body_str+'</tbody>';

const table = document.getElementById("table4");
table.innerHTML=table_body_str;

var checkboxes = document.querySelectorAll("input[type=checkbox][name=item_checkbox]")
checkboxes.forEach(function(checkbox) {
checkbox.addEventListener('change', function() {

        console.log(checkbox.dataset.item);

    
    })
});
var fn_buts = document.querySelectorAll("button[name^=fn_btn]")
fn_buts.forEach(function(fn_but) {
    fn_but.addEventListener('click', function() {

        console.log(fn_but.dataset.item+"--"+fn_but.name);

    
    })
});
var menu_buts = document.querySelectorAll("a[name^=menu_]");
var selectedMenu=null;
menu_buts.forEach(function(menu_but) {
    if(selectedMenu == null) {
        selectedMenu=menu_but;
        
        //console.log($('a[name='+menu_but.name+"]").css('background-color'));
        selectedMenu.style.color='white';
        selectedMenu.style.textShadow ='none';
        selectedMenu.style.background='#1362B7';
    }
    menu_but.addEventListener('click', function() {
        if(selectedMenu != null) {
            selectedMenu.style.color='black';
            selectedMenu.style.textShadow ='rgb(243, 243, 243) 0px 1px 0px';
            selectedMenu.style.background='rgb(243, 243, 243)';
        }
        var pre_table=$(selectedMenu.dataset.page);
        pre_table.addClass('hide');
        selectedMenu=menu_but;
        
        //console.log($('a[name='+menu_but.name+"]").css('background-color'));
        selectedMenu.style.color='white';
        selectedMenu.style.textShadow ='none';
        selectedMenu.style.background='#1362B7';
        
        var table=$(menu_but.dataset.page);

        table.removeClass('hide');
    //console.log(table);
    });
});