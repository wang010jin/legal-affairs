var table_execute_data=[
    {id:1,caseNo:"A202311110005",caseName:"管文波离职案件",caseLabel:2,caseReason:0,caseType:0,caseBelong:"北七家",applicant:"张国庆",penaltyAmount:500.00,exexuteAmount:300.00,caseCause:6,caseStatus:2,caseExeStatus:1,createDate:"2023-11-11 14:03:19"},
    {id:2,caseNo:"A202311110004",caseName:"产品商标案件",caseLabel:0,caseReason:0,caseType:0,caseBelong:"北七家",applicant:"李晓霞",penaltyAmount:500.00,exexuteAmount:300.00,caseCause:8,caseStatus:1,caseExeStatus:0,createDate:"2023-11-11 14:03:19"}
];
let execute_buts='<div data-role="controlgroup" data-type="horizontal" data-mini="true">'+
                '<button name="exe_btn_add" class="btn-icon-blue" data-icon="plus" data-iconpos="notext" data-item={0}>新增执行</button>'+
                '<button name="exe_btn_complete" class="btn-icon-green" data-icon="check" data-iconpos="notext" data-item={0}>执行结案</button>'+
            '</div>';
const table_execute = document.getElementById("table3");
table_execute.innerHTML= _createProgressTableHTML(table_execute_data);


document.querySelectorAll("td[name='execute_but']").forEach((pbut)=>{


    var but=new ProgressButton({
        steps:case_execute_status,
        showLabel:true,
        width:140,
        currentPosition:parseInt(pbut.dataset.value),
        containerId:'#'+pbut.id,
        duration:300,
        dataId:parseInt(pbut.dataset.index),
      });
      $(but.instance).bind('stepChanged',function (e){
        console.log(e);

        table_execute_data.forEach((item)=>{
            if(item.id == e.dataId){
                item.caseExeStatus=e.position;
                console.log($("#execute_status_text_"+parseInt(pbut.dataset.index)).text());
                $("#execute_status_text_"+parseInt(pbut.dataset.index)).text('状态：'+case_execute_status[item.caseExeStatus]);
                return;
            }
        });
      });
      var exe_buts = document.querySelectorAll("button[name^=exe_btn_]")
      exe_buts.forEach(function(exe_but) {
        exe_but.addEventListener('click', function() {

                console.log(exe_but.dataset.item+"--"+exe_but.name);

            
            })
        });
});
function _createProgressTableHTML(data){
    var item_html="";

    data.forEach((item)=>{


        var item_col_html="";
        var style=" style='max-width:100px;{0}'";
        var background="";
        var color="";
        
        if(case_labels_colors[case_labels[item.caseLabel]].background){
            
            background="background:"+case_labels_colors[case_labels[item.caseLabel]].background+";";
        }
        if(case_labels_colors[case_labels[item.caseLabel]].color){
            color="color:"+case_labels_colors[case_labels[item.caseLabel]].color+";";
        }
        if(background.length>0 || color.length>0){
            
            style=formatString(style,(background.length>0?background:"")+(color.length>0?color:""));
            console.log("color---"+item.caseNo+": "+style);
        }
        else{
            //style="";

        }

        //console.log(item.caseNo+": "+style);
        item_col_html+='<td class="text-center" '+style+'><div>'+case_labels[item.caseLabel]+'</div></td>';
        item_col_html+='<td><div style="font-size:18px;font-weight:700;">案件编号：'+item.caseNo+'</div><div>案件名称：'+item.caseName+'</div></td>';
        item_col_html+='<td><div>案发原因：'+case_reason[item.caseReason]+'</div><div>提交日期：'+item.createDate+'</div></td>';
        item_col_html+='<td><div>案由：'+case_causes[item.caseCause]+'</div><div id="execute_status_text_'+item.id+'">状态：'+case_execute_status[item.caseExeStatus]+'</div></td>';
        item_col_html+='<td><div>判决金额：'+item.penaltyAmount+'万</div><div>执行金额：'+item.exexuteAmount+'万</div></td>';
        item_col_html+='<td id="execute_but_'+item.id+'" name="execute_but" data-index='+item.id+' data-value='+item.caseExeStatus+'></td>';
        //item_col_html+=`<td>${formatString(execute_buts,item["id"])}</td>`;
        item_html+='<tr class="table-row">'+item_col_html+'</tr>';
    });
    return '<tbody>'+item_html+'</tbody>';
    
}