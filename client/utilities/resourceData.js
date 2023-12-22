var resourceDatas={};
var progresses=["一审","二审","执行",["强制执行","正常执行","未执行"],"结案","再审"];  
var property_status=["查封","冻结"];
var case_types=["被诉","主诉"];
var case_catelogs=["诉讼","仲裁"];
var corporate_companies=["国瑞兴业建筑工程设计有限公司","国瑞德恒房地产开发有限公司","国瑞兴业地产股份有限公司",
"益万家文化传播有限公司","国瑞兴业健康科技有限公司","大兴区保障性住房建设投资有限公司","浩业环宇装饰工程有限公司",
"文华盛达房地产开发有限公司"
];
var corporate_partners=["张丽佳","李立","郑智"];
var caseRelatedParty={
    "公司":corporate_companies,
    "个人":corporate_partners
}
var casePersonnel={}
var auth_levels=["一般","主管","管理员"];
var legalAffairs=["无","贺璐璐","李俊峰","王培斯"];
var legal_agencies=[
    {name:'贺璐璐',contact:'',authLevel:1},
    {name:'李俊峰',contact:'',authLevel:1},
    {name:'王培斯',contact:'',authLevel:0},
]
var lawFirms=["无","君合","白朗"];
var law_firms=["君合","白朗"];


var _attorneys=[
    {name:'李海孚',contact:'57362323',lawFirm:0},
    {name:'崔瀚文',contact:'57362676',lawFirm:1},
]
var Attorneys={"君合":["李海孚"],"白朗":["崔瀚文"]};
var projects=["北七家","大兴","test"];
var case_orgnization=["大兴法院","东城法院"];
var counsel_titles=["其他","书记员","法官"];
var legal_counsels=[
    {name:'李新亮',contact:'57362323',title:2,institution:0},
    {name:'郭艳',contact:'57362676',title:2,institution:0},
    {name:'张振',contact:'57362300',title:2,institution:0},
    {name:'张东莹',contact:'57362564',title:0,institution:1},
    {name:'郑少杰',contact:'57362579',title:1,institution:0},
    {name:'高新宇',contact:'57362335',title:1,institution:0}
]
var case_orgnizationPersonnel={
    "法官":["李新亮 57362323","郭艳 57362676","张振 57362300"],
    "其他":["张东莹 57362564","郑少杰 57362579","高新宇 57362335"]
}
var case_labels=["普通案件","重大案件300万以上","重大案件1000万以上","重大案件 群诉","重大案件1 群诉"];
var case_reason=["逾期交付","逾期办证","捆绑销售","逾期付款","断供担保","断供追偿","执行异议"];
var case_causes=["购房合同纠纷","建设工程纠纷","佣金类纠纷","断供担保纠纷","断供担保纠纷",
                "断供追偿纠纷","劳动争议纠纷","金融借款纠纷","行政诉讼","民间借贷纠纷","房屋租赁合同纠纷",
                "拆迁安置纠纷","服务合同纠纷","物业服务合同纠纷","车位使用权转让纠纷","股权转让纠纷","侵权纠纷",
                "建筑物区分所有权","案外人执行异议之诉","票据追索权纠纷",];
var case_status=["一审","二审","执行","结案","再审","审判监督程序",];
var case_execute_status=["未执","强执","结案"];
var case_labels_colors={
    "普通案件":{background:"skyblue",'text-shadow': 'none','text-align': 'center','font-weight':'700'},
    "重大案件300万以上":{background:"orange",color:"white",'text-shadow': 'none','text-align': 'center','font-weight':'700'},
    "重大案件1000万以上":{background:"#E25C62",color:"white",'text-shadow': 'none','text-align': 'center','font-weight':'700'},
    "重大案件 群诉":{background:"blue",color:"white",'text-shadow': 'none','text-align': 'center','font-weight':'700'},
    "重大案件1 群诉":{background:"blue",color:"white",'text-shadow': 'none','text-align': 'center','font-weight':'700'}
}
const basicTableList={
    caseStatus:{tablename:"case_status",data:progresses,template:_caseStatus},
    caseLabels:{tablename:"case_labels",data:case_labels_colors,template:caseLabels},
    caseTypes:{tablename:"case_types",data:case_types,template:caseTypes},
    caseCatelogs:{tablename:"case_catelogs",data:case_catelogs,template:caseCatelogs},
    caseCauses:{tablename:"case_causes",data:case_causes,template:caseCauses},
    caseReason:{tablename:"case_reasons",data:case_reason,template:caseReason},
    propertyStatus:{tablename:"property_status",data:property_status,template:_propertyStatus},
    projects:{tablename:"projects",data:projects,template:project},
    corporateCompanies:{tablename:"corporate_companies",data:corporate_companies,template:corporateCompanies},
    corporatePartners:{tablename:"corporate_partners",data:corporate_partners,template:corporatePartners},
    //legalAgencies:{tablename:"legal_agencies",data:legal_agencies,template:legalAgencies},
    authLevels:{tablename:"auth_levels",data:auth_levels,template:authLevels},
    legalInstitution:{tablename:"legal_institution",data:case_orgnization,template:legalInstitution},
    legalCounsels:{tablename:"legal_counsels",data:legal_counsels,template:legalCounsel},
    counselTitles:{tablename:"counsel_titles",data:counsel_titles,template:counselTitles},
    lawFirms:{tablename:"law_firms",data:law_firms,template:_lawFirms},
    attorneys:{tablename:"attorneys",data:_attorneys,template:attorneys},
}
const caseTableList={
    //userList:{tablename:"names",template:users},
    caseStatus:{tablename:"caseStatus",template:caseStatus},
    casesDb:{tablename:"cases",template:columns},
    caseUpdates:{tablename:"caseUpdates",template:caseUpdates},
    caseExcutes:{tablename:"caseExcutes",template:caseExcutes},
    caseProperties:{tablename:"caseProperties",template:properties},
    caseAttachments:{tablename:"caseAttachments",template:attachments},
    caseLinked:{tablename:"caseLinked",template:_caseLinked},
}
const caseInfoList={
    caseStatus:{tablename:"caseStatus",template:caseStatus},
    casesDb:{tablename:"cases",template:columns},
}
const tableNamesMatcher={
    updatesId:"caseUpdates",
    excutesId:"caseExcutes",
    propertyId:"caseProperties",
    evidenceId:"caseAttachments",
    caseLinked:"caseLinked",
}