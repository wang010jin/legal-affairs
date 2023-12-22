//案件基本数据
const table_progress_data=[
    {id:1,caseNo:"A202311110005",caseName:"管文波离职案件",caseLabel:2,caseReason:0,caseType:0,caseBelong:"北七家",applicant:"张国庆",caseCause:6,createDate:"2023-11-11 14:03:19",isReadOnly:true},
    {id:2,caseNo:"A202311110004",caseName:"产品商标案件",caseLabel:0,caseReason:0,caseType:0,caseBelong:"北七家",applicant:"李晓霞",caseCause:8,courtDate:"2023-12-15 14:00:00",createDate:"2023-11-11 14:03:19",isReadOnly:true}
];
//案件进展数据
const table_progress_status=[
  {id:1,caseNo:"A202311110005",caseLegal:1,caseLawfirm:"",caseAttorney:"",FristCounterData:"2023-12-11 14:00:00",SecondCounterData:"",penaltyAmount:500.00,exexuteAmount:300.00,caseStatus:4.1,courtName:"东城法院"},
  {id:2,caseNo:"A202311110004",caseLegal:0,caseLawfirm:1,caseAttorney:"",FristCounterData:"2023-12-11 14:00:00",SecondCounterData:"",penaltyAmount:500.00,exexuteAmount:300.00,caseStatus:1,courtName:"大兴法院"}
]
//案件资产数据
const table_progress_property=[
  {id:1,caseNo:"A202311110005",caseStatusId:0,subId:0,propertyName:"未知",propertyStatus:1,dateUpdated:"2023-11-01 14:00:00"},
  {id:2,caseNo:"A202311110004",caseStatusId:0,subId:0,propertyName:"未知",propertyStatus:0,dateUpdated:"2023-12-01 14:00:00"},
]
//案件进展明细数据
const table_progress_updates=[
  {id:1,subid:0,caseStatusId:0,caseNo:"A202311110005",caseUpdated:"23.9.28送达一审判决书",caseDisputed:"",dateUpdated:"2023-11-01 14:00:00"},
  {id:1,subid:1,caseStatusId:0,caseNo:"A202311110005",caseUpdated:"23.9.28送达一审判决书",caseDisputed:"",dateUpdated:"2023-11-01 14:00:00"},
  {id:1,subid:0,caseStatusId:1,caseNo:"A202311110005",caseUpdated:"23.10.28送达二审判决书",caseDisputed:"",dateUpdated:"2023-11-01 14:00:00"},
  {id:2,subid:0,caseStatusId:0,caseNo:"A202311110004",caseUpdated:"一审，尚未收到诉状，对方已申请查封。",caseDisputed:"",dateUpdated:"2023-11-11 14:00:00"}
]
//案件附件数据
const table_progress_updates_attachments=[
  {id:1,evidenceId:0,caseStatusId:0,caseNo:"A202311110005",numFile:2,numCPage:5,numCopy:1,numOriginal:1,fileName:"审判决书",filePath:"",dateUploaded:"2023-11-01 14:00:00"},
]
//案件执行明细数据
const table_progress_executes=[
  {id:1,subId:0,caseStatusId:3.1,caseNo:"A202311110005",personExecuted:"张三",personContact:18612221231,purposeExecute:"财产",exexuteAmount:200,sumExecuted:"",dateExecuted:"2023-11-01 14:00:00"},
  {id:1,subId:1,caseStatusId:3.1,caseNo:"A202311110005",personExecuted:"张五",personContact:1572312534,purposeExecute:"",exexuteAmount:34,sumExecuted:"",dateExecuted:"2023-12-01 14:00:00"},
]

var caseStatus_=[
  {id:1,subid:0,updatesId:0,caseStatus:0,caseNo:"A202311110005",updateDetails:"23.9.28送达一审判决书",caseDisputed:"",dateUpdated:"2023-11-01 14:00:00",dateOccur:"2023-09-28 14:00:00",attachments:"0"},
  {id:1,subid:1,updatesId:1,caseStatus:0,caseNo:"A202311110005",updateDetails:"23.10.13送达判决书",caseDisputed:"",dateUpdated:"2023-11-02 14:00:00",dateOccur:"2023-10-13 14:00:00",attachments:""},
  {id:1,subid:0,updatesId:2,caseStatus:1,caseNo:"A202311110005",updateDetails:"23.10.28送达二审判决书",caseDisputed:"",dateUpdated:"2023-12-01 14:00:00",dateOccur:"2023-10-28 14:00:00",attachments:""}
]
var caseExcutes_=[
  {id:1,subId:0,excutesId:0,caseStatus:3.1,caseNo:"A202311110005",personExecuted:"张三",personContact:18612221231,targetExecuted:"财产",exexuteAmount:200,sumExecuted:"",attachments:"",dateExecuted:"2023-12-11 14:00:00"},
  {id:1,subId:1,excutesId:1,caseStatus:3.1,caseNo:"A202311110005",personExecuted:"张五",personContact:1572312534,targetExecuted:"",exexuteAmount:34,sumExecuted:"",attachments:"",dateExecuted:"2023-12-21 14:00:00"},
]
var caseProperties_=[
  {id:1,caseNo:"A202311110005",propertyId:0,caseStatus:3.1,subId:0,propertyName:"未知",propertyStatus:1,dateUpdated:"2023-12-01 14:00:00",dateOccur:"2023-12-01 14:00:00"},
]
var caseAttachments_=[
  {id:1,evidenceId:0,caseStatus:0,caseNo:"A202311110005",numFile:2,numCPage:5,numCopy:1,numOriginal:1,fileLabel:"审判决书",filePath:"/1/判决书.pdf",dateUploaded:"2023-11-01 14:00:00"},
]