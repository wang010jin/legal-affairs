var isRunLocal=true;
var IPS=['192.168.10.68','192.168.10.69','cn.luyao.site']
var showDebug=false;
let ip=isRunLocal?IPS[1]:IPS[2];
let port=5556;
var auth_code='1234';
var adminLevel=3;
const keyStr = 'it@glory.com'
const ivStr = 'it@glory.com'
var enableConsoleLog=true;
var enableRealDelete=true;
var enableReadOnlyMode=false;
var functionButoonPostion="top";
const mainPage="legal.html";
var logoSrc='./images/logo.png'
var DataList={};
var preload_completed_event_name="preloadCompleted";
var main_load_completed_event_name="mainDataloadCompleted";
var userDbTableName="names";
class Message{
    static LOGIN_IS_EMPTY='<p style="color:red;">用户名和密码不能为空</p>';
    static LOGIN_ISNOT_MATCH='<p style="color:red;">用户名和密码不匹配</p>';
    static LOGIN_WELCOME_F='<p style="color:red;">欢迎{0}回来</p>';
    static PROGRESS_DELETE_WARNING_F='确定删除此流程点[{0}]后已存在其它流程点吗？';
}
var position=['无','法务人员','法务管理']
var deads=["无需执行"]; 
const TextColor="rgb(51, 51, 51)";
const users={
    id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
    user:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
    pass:"VARCHAR(255) NOT NULL",//我方当事人->corporateCompanies* && corporatePartners*
    name:"VARCHAR(255)",//我方当事人->corporateCompanies* && corporatePartners*
    position:"INT NOT NULL DEFAULT '0'",//所属项目->projects*
    level:"INT NOT NULL DEFAULT '0'",//所属项目->projects*
    createDate:"datetime NOT NULL",//申请日期
    contact:"VARCHAR(255)",
    descriptions:"VARCHAR(255)",
    isInactived:"VARCHAR(255)",
}
const columns={//案件主表
    id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
    caseNo:"VARCHAR(255),UNIQUE",//案件编号
    caseName:"VARCHAR(255) NOT NULL",//案件名称
    caseLabel:"INT NOT NULL DEFAULT '0'",//案件标签->caseLabels*
    //caseDepartment:"INT NOT NULL DEFAULT '0'",
    //caseCompany:"INT NOT NULL DEFAULT '0'",
    caseProject:"INT NOT NULL DEFAULT '0'",//所属项目->projects*
    casePersonnel:"VARCHAR(255) NOT NULL",//我方当事人->corporateCompanies* && corporatePartners*
    case2ndParty:"VARCHAR(255) NOT NULL",//对方当事人
    caseCatelog:"INT NOT NULL DEFAULT '0'",//案件类别->caseCatelogs*
    //caseBelongs:"INT NOT NULL DEFAULT '0'",
    caseType:"INT NOT NULL DEFAULT '0'",//案件类型->caseTypes*
    caseAttachments:"varchar(1000)",//案件附件->attachments
    caseCause:"INT NOT NULL DEFAULT '0'",//案由->caseCauses*
    caseDate:"datetime NOT NULL",//立案日期
    //legalInstitution:"INT default '0' NOT NULL",//受理机构->legalInstitution*
    //legalCounsel:"varchar(255)",//受理相关人->legalCounsel*
    caseReason:"INT NOT NULL DEFAULT '0'",//案发原因->caseReason*
    requestAmount:"VARCHAR(255) default '0.00'",//本诉金额
    appealAmount:"VARCHAR(255) default '0.00'",//反诉金额
    caseCounterclaimRequest:"varchar(1000)",//本诉请求
    caseLawsuitRequest:"varchar(1000)",//反诉请求
    caseSum:"varchar(1000)",//案件摘要
    caseApplicant:"varchar(255) NOT NULL",//申请人
    caseCreateDate:"datetime NOT NULL",//申请日期
    isReadOnly:"bool NOT NULL",//文档只读
}
const caseStatus={//案件状态
  id:"INT NOT NULL,PRIMARY KEY",//案件唯一序列号
  caseNo:"VARCHAR(255) NOT NULL,UNIQUE",//案件编号
  caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
  legalAgencies:"INT(11) NOT NULL",//代理法务->legalAgencies*
  lawFirm:"INT(11) NOT NULL",//代理律所->lawFirms*
  attorney:"VARCHAR(100) default '无0'",//代理律师->attorneys*
  FirstInstance:"datetime",//一审日期
  SecondInstance:"datetime",//二审日期
  //court:"VARCHAR(255)",//法院->courts
  legalInstitution:"INT(11) default '0' NOT NULL",//受理机构->legalInstitution*
  legalCounsel:"varchar(255)",//受理相关人->legalCounsel*
  //appealAmount:"VARCHAR(255) default '0.00'",//反诉金额
  //requestAmount:"VARCHAR(255) default '0.00'",//本诉金额
  penalty:"VARCHAR(255) default '0.00'",//判决金额
  paidAmount:"VARCHAR(255) default '0.00'",//执行金额
  isInactived:"INT(1) default '0' NOT NULL"
}
const caseUpdates={//案件每个状态点对应的更新
    id:"INT(11) NOT NULL",//案件唯一序列号
    updatesId:"INT NOT NULL default '0',UNIQUE",//案件序号子附件序列号
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    subId:"INT(11) NOT NULL default '0'",//案件序号子序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    updateDetails:"VARCHAR(255)",//案件更新事件内容
    dateOccur:"datetime",//案件更新事件发生日期
    dateUpdated:"datetime",//更新提交日期
    caseDisputed:"VARCHAR(255)",//案件争议
    attachments:"VARCHAR(255)",//案件附件
    isInactived:"INT(1) default '0' NOT NULL"
}

const caseExcutes={//案件执行数据
    id:"INT NOT NULL",//案件唯一序列号
    excutesId:"INT NOT NULL default '0',UNIQUE",//案件序号子附件序列号
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    subId:"INT NOT NULL default '0'",//案件序号子序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    personExecuted:"VARCHAR(100)",//执行人
    personContact:"INT",//执行人电话
    targetExecuted:"VARCHAR(255)",//执行标的
    exexuteAmount:"VARCHAR(255) default '0.00'",//执行金额
    sumExecuted:"VARCHAR(1000)",//执行概要
    dateExecuted:"datetime",//执行日期
    attachments:"VARCHAR(255)",//案件附件
    isInactived:"INT(1) default '0' NOT NULL"
}
const properties={//资产状态数据
    id:"INT NOT NULL",//案件唯一序列号
    propertyId:"INT NOT NULL default '0',UNIQUE",//案件序号子附件序列号
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    subId:"INT NOT NULL default '0'",//案件序号子序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    propertyName:"VARCHAR(255)",//资产名称
    propertyStatus:"INT NOT NULL default '-1'",//资产状态->propertyStatus*
    dateUpdated:"datetime",//更新提交日期
    dateOccur:"datetime",//案件更新事件发生日期
    attachments:"VARCHAR(255)",//案件附件
    isInactived:"INT(1) default '0' NOT NULL"
}
const attachments={//案件相关文件
    id:"INT NOT NULL",//案件唯一序列号
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    evidenceId:"INT NOT NULL default '0',UNIQUE",//案件序号子附件序列号
    caseStatus:"VARCHAR(100) default '0.0'",//案件状态->caseStatus*
    numFile:"INT NOT NULL default '0'",//附件数
    numCPage:"INT NOT NULL default '0'",//附件页数
    numCopy:"INT NOT NULL default '0'",//附件复印件数
    numOriginal:"INT NOT NULL default '0'",//附件原件件数
    fileLabel:"VARCHAR(255)",//附件名称
    filePath:"VARCHAR(255)",//附件地址
    dateUploaded:"datetime",//上传日期
    isInactived:"INT(1) default '0' NOT NULL"
}
const _caseLinked={//案件状态
    id:"INT(11) NOT NULL",//案件状态唯一序列号
    caseStatus:"VARCHAR(100) default '0'",//案件状态子序列号
    caseId:"INT(11) NOT NULL",//案件状态名称
    caseNo:"VARCHAR(255) NOT NULL",//案件编号
    linkId:"INT(11) NOT NULL,PRIMARY KEY",//案件类型说明
    isInactived:"INT(1) default '0' NOT NULL"
}
const _caseStatus={//案件状态
    id:"INT NOT NULL,PRIMARY KEY",//案件状态唯一序列号
    isMain:"bool default '1'",//案件状态子序列号
    name:"VARCHAR(255)",//案件状态名称
    descriptions:"VARCHAR(255)",//案件类型说明
}
const caseLabels={//案件标签
    id:"INT NOT NULL,PRIMARY KEY",//案件标签唯一序列号
    label:"VARCHAR(255)",//案件标签名
    labelStyle:"VARCHAR(255)",//案件标CSS设置数据
    descriptions:"VARCHAR(255)",//案件标签说明
}
const caseTypes={//案件类型
    id:"INT NOT NULL,PRIMARY KEY",//案件类型唯一序列号
    label:"VARCHAR(255)",//案件类型名
    descriptions:"VARCHAR(255)",//案件类型说明
}
const caseCatelogs={//案件类别
    id:"INT NOT NULL,PRIMARY KEY",//案件类别唯一序列号
    label:"VARCHAR(255)",//案件类别名
    descriptions:"VARCHAR(255)",//案件类别说明
}
const caseCauses={//案由
    id:"INT NOT NULL,PRIMARY KEY",//案由唯一序列号
    label:"VARCHAR(255)",//案由名
    descriptions:"VARCHAR(255)",//案由名说明
}
const caseReason={//案发原因
    id:"INT NOT NULL,PRIMARY KEY",//案发原因唯一序列号
    label:"VARCHAR(255)",//案发原因类型
    descriptions:"VARCHAR(255)",//案发原因类型说明
}
const _propertyStatus={//资产状态
    id:"INT NOT NULL,PRIMARY KEY",//资产状态唯一序列号
    label:"VARCHAR(255)",//资产状态名称
    descriptions:"VARCHAR(255)",//资产状态说明
}
const project={//项目列表
    id:"INT NOT NULL,PRIMARY KEY",//项目列表唯一序列号
    name:"VARCHAR(255)",//项目名称
    address:"VARCHAR(255)",//项目地址
    region:"VARCHAR(255)",//项目地区
    descriptions:"VARCHAR(255)",//项目说明
    isInactived:"bool default '0'",//是否标为禁用
}
const corporateCompanies={//案件当事公司
    id:"INT NOT NULL,PRIMARY KEY",//当事公司唯一序列号
    name:"VARCHAR(255)",//当事公司名称
    address:"VARCHAR(255)",//当事公司地址
    region:"VARCHAR(255)",//当事公司地区
    descriptions:"VARCHAR(255)",//当事公司说明
    isInactived:"bool default '0'",//是否标为禁用
}
const corporatePartners={//案件当事人
    id:"INT NOT NULL,PRIMARY KEY",//当事人唯一序列号
    name:"VARCHAR(255)",//当事人名字
    contact:"VARCHAR(255)",//当事联系方式
    descriptions:"VARCHAR(255)",//当事人说明
    isInactived:"bool default '0'",//是否标为禁用
}
const legalAgencies={//法务
    id:"INT NOT NULL,PRIMARY KEY",//法务唯一序列号
    name:"VARCHAR(255)",//法务名字
    contact:"VARCHAR(255)",//法务联系方式
    authLevel:"INT NOT NULL default '0'",//法务权限->authLevels*
    descriptions:"VARCHAR(255)",//法务说明
    isInactived:"bool default '0'",//是否标为禁用
}
const authLevels={//应用权限
    id:"INT NOT NULL,PRIMARY KEY",//应用权限唯一序列号
    descriptions:"VARCHAR(255)",//应用权限说明
}
const legalInstitution={//受理机构
    id:"INT NOT NULL,PRIMARY KEY",//受理机构唯一序列号
    name:"VARCHAR(255)",//受理机构名称
    contact:"VARCHAR(255)",//受理机构联系方式
    address:"VARCHAR(255)",//受理机构地址
    descriptions:"VARCHAR(255)",//受理机构说明
    isInactived:"bool default '0'",//是否标为禁用
}
const legalCounsel={//受理人
    id:"INT NOT NULL,PRIMARY KEY",//受理人唯一序列号
    name:"VARCHAR(255)",//受理人名字
    contact:"VARCHAR(255)",//受理人联系方式
    title:"INT NOT NULL default '0'",//受理人职务->counselTitles*
    institution:"INT NOT NULL default '-1'",//受理人所属机构
    descriptions:"VARCHAR(255)",//受理人说明
    isInactived:"bool default '0'",//是否标为禁用
}
const counselTitles={//受理人职务
    id:"INT NOT NULL,PRIMARY KEY",//受理人职务唯一序列号
    label:"VARCHAR(255)",//受理人职务名称
    descriptions:"VARCHAR(255)",//受理人职务说明
}
const _lawFirms={//代理律所列表
    id:"INT NOT NULL,PRIMARY KEY",//代理律所唯一序列号
    name:"VARCHAR(255)",//代理律所名称
    contact:"VARCHAR(255)",//代理律所联系方式
    address:"VARCHAR(255)",//代理律所地址
    descriptions:"VARCHAR(255)",//代理律所说明
    isInactived:"bool default '0'",//是否标为禁用
}
const attorneys={//代理律师列表
    id:"INT NOT NULL,PRIMARY KEY",//代理律师唯一序列号
    name:"VARCHAR(255)",//代理律师名字
    contact:"VARCHAR(255)",//代理律师联系方式
    lawFirm:"INT NOT NULL default '-1'",//代理律师所属机构
    descriptions:"VARCHAR(255)",//代理律师说明
    isInactived:"bool default '0'",//是否标为禁用
}

