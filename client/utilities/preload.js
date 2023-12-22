

var result=[];
var collectDbList=true;

$('#loadingLogo').attr('src',logoSrc)
$('#headerLogo').attr('src',logoSrc)
goToPage('#');
$('#mainFooter').hide();
//getBasicDatabaseData();
$('#mainLoadingMessage').text('读取中...');
waitTask(logingStatus(),function(){
    updateLastLogin(getGlobalJson("currentUser").id).then((r)=>console.log);
    getLegalAgencies().then(d=>{
        console.log('getLegalAgencies',d)
        var agencies=d.data.filter(dd=>dd.position>0 && dd.isInactived==0);
        resourceDatas['legalAgencies']=agencies;
        resourceDatas['users']=d.data.filter(dd=>dd.id>0);
    })
    getBasic(basicTableList,[]).then(d=>{
        //console.log(d.data.attorneys);
        if(d.data!=undefined){
            
            $.each(d.data,(k,d)=>{
                //$('#mainLoadingMessage').text('读取中...'+k);
                if(showDebug)console.log(`Data from ${k}:`, d);
                if(k=="projects"){
                    projects=getKeyValues(d,"name");
                    resourceDatas[k]=projects;
                    resourceDatas[k+"_"]=d;
                    //console.log(projects);
                }
                else if(k=="caseLabels"){
                    case_labels=getKeyValues(d,"label");
                    var _data={}
                    $.each(d,(i,element) => {
                        _data[element.label]=JSON.parse(element.labelStyle);
                    });
                    case_labels_colors=_data;
                    
                    resourceDatas[k]=case_labels;
                    resourceDatas[k+"_"]=d;
                    resourceDatas['caseLabelsColors']=_data;
                    //console.log(`Data from caseLabelsColors:`, _data);
                    //FormTemplate3.template.baseInfo.data.caseLabel.data=getKeyValues(d,"label");
                }
                else if(k=="caseReason"){
                    case_reason=getKeyValues(d,"label")
                    resourceDatas[k]=case_reason;
                    resourceDatas[k+"_"]=d;
                }
                else if(k=="caseCauses"){
                    case_causes=getKeyValues(d,"label")
                    resourceDatas[k]=case_causes;
                    resourceDatas[k+"_"]=d;
                }
                else if(k=="caseStatus"){
                    progresses=[];
                    progresses_object={};
                    var collector=[];
                    $.each(d,(index,_d)=>{
                        if(_d.isMain){
                            if(collector.length>0) {
                                progresses.push(collector);
                                collector=[];
                            }
                            progresses.push(_d.name)
                            progresses_object[_d.id]=_d.name;
                        }else{
                            collector.push(_d.name);
                            progresses_object[_d.id]=_d.name;
                        }
                    });
                    resourceDatas[k]=progresses;
                    var progresses_object=[];
                    progresses.forEach((prog=>{
                        if(prog instanceof Array){
                            progresses_object.push({name:"执行中",data:prog});
                        }else{
                            progresses_object.push(prog);
                        }
                    }))
                    resourceDatas[k+"_object"]=progresses_object;
                }
                else if(k=="propertyStatus"){
                    property_status=getKeyValues(d,"label")
                    resourceDatas[k]=property_status;
                    resourceDatas[k+"_"]=d;
                }
                else if(k=="caseTypes"){
                    case_types=getKeyValues(d,"label")
                    resourceDatas[k]=case_types;
                    resourceDatas[k+"_"]=d;
                }
                else if(k=="caseCatelogs"){
                    case_catelogs=getKeyValues(d,"label")
                    resourceDatas[k]=case_catelogs;
                    resourceDatas[k+"_"]=d;
                }
                else if(k=="corporateCompanies"){
                    corporate_companies=getKeyValues(d,"name")
                    resourceDatas[k]=corporate_companies;
                    
                    casePersonnel["公司"]=d;
                }
                else if(k=="corporatePartners"){
                    corporate_partners=getKeyValues(d,"name")
                    resourceDatas[k]=corporate_partners;
                    
                    casePersonnel["个人"]=d;
                }
                else if(k=="authLevels"){
                    auth_levels=getKeyValues(d,"descriptions")
                    resourceDatas[k]=auth_levels;
                    resourceDatas[k+"_"]=d;
                }
                /*
                else if(k=="legalAgencies"){
                    legalAffairs=getKeyValues(d,"name")
                    resourceDatas[k]=legalAffairs;
                }
                */
                else if(k=="lawFirms"){
                    lawFirms=getKeyValues(d,"name")
                    resourceDatas[k]=lawFirms;
                    resourceDatas[k+"_"]=d;
                }
                else if(k=="legalInstitution"){
                    case_orgnization=getKeyValues(d,"name")
                    resourceDatas[k]=case_orgnization;
                    resourceDatas[k+"_"]=d;
                }
                else if(k=="counselTitles"){
                    counsel_titles=getKeyValues(d,"label")
                    resourceDatas[k]=counsel_titles;
                    resourceDatas[k+"_"]=d;
                }
            });
            var _data={};
            $.each(resourceDatas['lawFirms_'],(index,lawFirm)=>{
                var _d=[];
                console.log('lawFirms',lawFirm,d.data['attorneys']);
                d.data['attorneys'].filter((attorney) => attorney.lawFirm==lawFirm.id).forEach((attorney)=>{
                    //attorney['value']=lawFirms+attorney.id;
                    _d.push(attorney);
                });
                _data[lawFirm.name]=_d;
            });
            Attorneys=_data;
            resourceDatas['attorneys']=_data;
    
            _data={};
            $.each(resourceDatas['counselTitles_'],(index,title)=>{
                var _d=[];
                //console.log('counselTitles_',title,d.data['legalCounsels'].filter((counsels) => counsels.title==title.id))
                
                d.data['legalCounsels'].filter((counsels) => counsels.title==title.id).forEach((counsel)=>{
                    //counsel['value']=title.label+counsel.id;
                    _d.push(counsel);
                });
                _data[title.label]=_d;//data.value['legalCounsels'].filter((counsels) => counsels.title==index);
                
            });
            
            case_orgnizationPersonnel=_data;
            resourceDatas['legalCounsels']=_data;
            //console.log('legalCounsels');
            //console.log(_data);
            
            caseRelatedParty=casePersonnel;
            //console.log(casePersonnel);
            resourceDatas['casePersonnel']=caseRelatedParty;
            //setGlobalJson('resourceDatas',resourceDatas);
            result.push(true);
            
            output('resourceDatas',resourceDatas);
            const intervalId = setInterval(() => {
                if (resourceDatas.hasOwnProperty('legalAgencies')) {
                    clearInterval(intervalId);
                    $('body').trigger(preload_completed_event_name);
                    console.log('trigger '+preload_completed_event_name);
                    if(collectDbList) $().mloader("show",{message:"加载表格数据....",overlay:true});
                    $('#main-container').addClass('hide');
                }
            }, 100);
            
            
        }
    });
    
    if(collectDbList){
        console.log('获取案件数据。。')
        //console.log('caseTableList',caseTableList)
        getBasic(caseTableList,[]).then(d=>{
            output('caseTableList completed: ',d.data);
            // console.log(d.data);
            
            var combinedData=[];
            d.data.casesDb.forEach((data)=>{
                var matchedData=d.data.caseStatus.filter(sta => sta.id==data.id);
                //console.log(matchedData);
                if(matchedData.length>0){
                    combinedData.push(Object.assign(data,matchedData[0]));
                }
            });
            
            //console.log(combinedData);
            DataList=d.data;
            if(!DataList.hasOwnProperty('caseUpdates')) DataList.caseUpdates=[];
            if(!DataList.hasOwnProperty('caseExcutes')) DataList.caseExcutes=[];
            if(!DataList.hasOwnProperty('caseProperties')) DataList.caseProperties=[];
            if(!DataList.hasOwnProperty('caseAttachments')) DataList.caseAttachments=[];
            if(!DataList.hasOwnProperty('caseLinked')) DataList.caseLinked=[];
            DataList.combinedData=combinedData;
            //DataList.combinedData=d.data.casesDb;
            //setGlobalJson("combinedData",combinedData);
            //setGlobalJson("datalist",d.data);
            //console.log("setGlobalJson datalist: ",getGlobalJson("datalist"));
        
            result.push(true);
            $('body').trigger(main_load_completed_event_name);
        });
    }else{
        result.push(true);
    }
});

/*
const intervalId = setInterval(() => {
    if (result.length==2) {
        clearInterval(intervalId);
        if(sessionStorage.getItem("currentUser")!=undefined){
            $('body').trigger(preload_completed_event_name);
        }
        
    }
}, 100);
*/
function logingStatus(){
	//setGlobalJson("currentUser","{}");
	if(getGlobalJson("currentUser") && getGlobalJson("currentUser").name){
        output('currentUser',getGlobalJson('currentUser'));
        

        //condtions.push('legalAgencies='+getGlobalJson('currentUser').id);
        $.each(caseTableList,(key,settings)=>{
            settings['orderBy']="ORDER BY id DESC";
            if(key=='caseStatus'){
                if(getGlobalJson('currentUser').level==1){
                    settings['conditions']=' WHERE isInactived=0 AND legalAgencies='+getGlobalJson('currentUser').id;
                }else if (getGlobalJson('currentUser').level<adminLevel){
                    settings['conditions']=' WHERE isInactived=0';
                }
            }else if(key=='casesDb'){
                
                settings['orderBy']="ORDER BY caseStatus.id DESC";
                if(getGlobalJson('currentUser').level==1){
                    settings['conditions']='JOIN caseStatus ON '+
                    settings.tablename+'.id=caseStatus.id AND caseStatus.isInactived=0 AND caseStatus.legalAgencies='+getGlobalJson('currentUser').id;
                }else if (getGlobalJson('currentUser').level<adminLevel){
                    settings['conditions']='JOIN caseStatus ON '+
                    settings.tablename+'.id=caseStatus.id AND caseStatus.isInactived=0';
                }else{
                    settings['orderBy']="ORDER BY id DESC";
                }
            }else{
                if(getGlobalJson('currentUser').level==1){
                    settings['conditions']=' WHERE id IN ( SELECT id FROM caseStatus WHERE isInactived=0 AND legalAgencies='+getGlobalJson('currentUser').id+')';
                }else if (getGlobalJson('currentUser').level<adminLevel){
                    settings['conditions']=' WHERE id IN ( SELECT id FROM caseStatus WHERE isInactived=0)';
                }
            }
            
        });
        //'JOIN caseStatus ON cases.id=caseStatus.id AND caseStatus.legalAgencies=1'
		$('#username').text(getGlobalJson("currentUser").name);
        getCurrentUser({id:getGlobalJson("currentUser").id,pass:getGlobalJson("currentUser").pass,user:getGlobalJson("currentUser").user})
        .then((d)=>{
            if(d.data.length>0 && d.data[0].hasOwnProperty('isInactived') && d.data[0].isInactived==0){
                setGlobalJson("currentUser",d.data[0]);
            }else{
                showAutoLogin();
                return false;
            }
           
        });
        return true;
	}else{
		showAutoLogin();
        return false;
	}
}
function showAutoLogin(){
    $().minfo('show',{title:"错误",message:"账户问题，将自动跳转到登录页面？"});
    setTimeout(function() {
        window.location.href = 'index.html';
        $().minfo('hide');
    }, 2000);
}
