var headers={
    'Content-Type': 'application/json'
};
async function downloadFile(folder,fileName){
    window.location = "http://"+ip+":"+port+"/downloadLocal?fileName="+fileName+"&folder="+folder;
}
async function uploadFiles(folder,files){
    var results=[];
    $.each(files,(index,file)=>{
        var formData = new FormData();
        formData.append('file', file);
        formData.append('folder',folder);
        
        $.ajax({
          url: "http://"+ip+":"+port+"/uploadLocal",
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(response) {
            console.log(response);
            results.push({success:true,fileName:file});
          },
          error: function(xhr, status, error) {
            console.error('Error uploading file:', error);
            results.push({success:false,fileName:file,error:error});
          }
        });
    })
    return new Promise(resolve => {
        const intervalId = setInterval(() => {
        if (Object.keys(results).length === files.length) {
            clearInterval(intervalId);
            resolve(results);
        }
        }, 100);
    });
}
async function getCaseLatestIndex(){
    var latestId=-1;
    var query="SELECT * FROM cases ORDER BY id DESC LIMIT 1"
    await fetch("http://"+ip+":"+port+"/select",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ query: query})
    })
    .then(response => response.json())
    .then(data => {
        if(data['data'].length>0) latestId = data['data'][0].id;
    });
    return latestId;
}
async function getRecordLatestIndex(table,key,where){
    var latestId=-1;
    var where_str=where!=undefined?" WHERE "+where:"";
    var query="SELECT * FROM "+table+where_str+" ORDER BY "+key+" DESC LIMIT 1"
    await fetch("http://"+ip+":"+port+"/select",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ query: query})
    })
    .then(response => response.json())
    .then(data => {
        if(data['data'].length>0) latestId = data['data'][0][key];
    });
    return latestId;
}
async function getCasesData(res){
    var _data=undefined;
    var query="SELECT * FROM cases ORDER BY id ASC"
    await fetch("http://"+ip+":"+port+"/select",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ query: query})
    })
    .then(response => response.json())
    .then(data => {
        if(data['data'].length>0) _data=data['data'];
    });
    res(_data);
}
async function getCasesStatus(res){
    var _data=undefined;
    var query="SELECT * FROM caseStatus ORDER BY id ASC"
    await fetch("http://"+ip+":"+port+"/select",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ query: query})
    })
    .then(response => response.json())
    .then(data => {
        if(data['data'].length>0) _data=data['data'];
    });
    res(_data);
}
async function getLegalAgencies(){
    const response = new Promise(async(resolve,reject)=>{
        await fetch("http://"+ip+":"+port+"/select",{
            headers:headers,
            method: 'POST',
            body: JSON.stringify({ query: 'SELECT id,name,position,isInactived FROM '+userDbTableName})
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            resolve(data);
        }).catch(err => console.log(err));
        
    });
    return await response;
}
async function getUserList(res){
    var _data=undefined;
    await fetch('http://'+ip+':'+port+'/getAll')
    .then(response => response.json())
    .then(data => {if(data['data'].length>0) _data=data['data'];});
    if(res!=undefined)res(_data);
}
async function getCurrentUser(userData){
    var where=[];
    $.each(userData,(k,v)=>{
        if(v.constructor === String){
            where.push(k+" = '"+v+"'");
        }
    })
    const response = new Promise(async(resolve,reject)=>{
        await fetch("http://"+ip+":"+port+"/select",{
            headers:headers,
            method: 'POST',
            body: JSON.stringify({ query: 'SELECT * FROM '+userDbTableName+' WHERE '+where.join(' AND ')})
        })
        .then(response => response.json())
        .then(data => {
            resolve(data);
        }).catch(err => console.log(err));
        
    });
    return await response;
}
async function saveCurrentUser(userData,isRealInsert){
    var type=isRealInsert?'pureinsert':'insert';
    const response = new Promise(async(resolve,reject)=>{
        await fetch("http://"+ip+":"+port+"/"+type,{
            headers:headers,
            method: 'POST',
            body: JSON.stringify({ table: userDbTableName, data:userData})
        })
        .then(response => response.json())
        .then(data => {
            if (data.data.success){
                //resolve(data);
            }else{
                console.log(data.data.error);
            }
            resolve(data.data);
        }).catch(err => console.log(err));
        
    });
    return await response;
}
async function removeCase(id,table,res){
    await fetch("http://"+ip+":"+port+"/delete",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ table: table, id:id})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.error);
        
        if(res!=undefined)res(data);
    });
}
async function restoreCases(ids,res){
    await fetch("http://"+ip+":"+port+"/restoreCases",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ids:ids})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.error);
        
        if(res!=undefined)res(data);
    });
}
async function inactiveCases(ids,res){
    await fetch("http://"+ip+":"+port+"/inactiveCases",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ids:ids})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.error);
        
        if(res!=undefined)res(data);
    });
}
async function inactiveItem(where,table,res){
    await fetch("http://"+ip+":"+port+"/inactiveItem",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({where:where,table:table})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.error);
        
        if(res!=undefined)res(data);
    });
}
async function restoreItem(where,table,res){
    await fetch("http://"+ip+":"+port+"/restoreItem",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({where:where,table:table})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.error);
        
        if(res!=undefined)res(data);
    });
}
async function removeCases(ids,table,res){
    await fetch("http://"+ip+":"+port+"/deleteRows",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ table: table, ids:ids})
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.success){
            console.log(data.data.id);
        }else{
            console.log(data.data.error);
        }
        
        if(res!=undefined)res(data);
    });
}
async function insertCase(data,template,res){
    await fetch("http://"+ip+":"+port+"/insertCase",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ template: template, data:data})
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.success){
            console.log(data.data.id);
        }else{
            console.log(data.data.error);
        }
        if(res!=undefined)res(data.data);
    });
}
async function insert(table,data,res){
    await fetch("http://"+ip+":"+port+"/insert",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ table: table, data:data})
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.success){
            console.log(data.data.id);
        }else{
            console.log(data.data.error);
        }
        if(res!=undefined)res(data.data);
    });
}
async function insertRows(table,datas,res){
    await fetch("http://"+ip+":"+port+"/insertAll",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ table: table, data:datas})
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.success){
            console.log(data.data.id);
        }else{
            console.log(data.data.error);
        }
        if(res!=undefined)res(data.data);
    });
}
async function updateLastLogin(id){
    
    return await fetch("http://"+ip+":"+port+"/update",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ where:"id="+id, table: userDbTableName, data:{lastLogin:new Date().toLocaleString().substr(0,20)}})
    })
    .then(response => {
        //console.log('updateLastLogin',response);
        return response.json();
    });
}
async function update(where,table,data,res){
    await fetch("http://"+ip+":"+port+"/update",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ where:where, table: table, data:data})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        
        if(res!=undefined)res(data);
    });
}
async function createTable(table,template,res){
    await fetch("http://"+ip+":"+port+"/createTable",{
        headers:{
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ table: table, columns:template})
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.success){
            console.log(data.data.id);
        }else{
            console.log(data.data.error);
        }
        if(res!=undefined) res(data.data);
    });
}
async function getCasesStatus(condition){
    const response = new Promise(async(resolve,reject)=>{
        var whereStr="";
        if(condition.length>0){
            whereStr=' WHERE '+condition.join(' AND ');
        }
        await fetch("http://"+ip+":"+port+"/select",{
            headers:headers,
            method: 'POST',
            body: JSON.stringify({ query: 'SELECT * FROM caseStatus'+whereStr})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            resolve(data);
        }).catch(err => console.log(err));
        
    });
    return await response;
}
async function getData(table,res){
    var _data=undefined;
    var query="SELECT * FROM "+table+" ORDER BY id ASC";
    await fetch("http://"+ip+":"+port+"/select",{
        headers:headers,
        method: 'POST',
        body: JSON.stringify({ query: query})
    })
    .then(response => response.json())
    .then(data => {
        if(data['data'].length>0) _data=data['data'];
    });
    if(res!=undefined)res(_data);
}
function createBasicDatabase(list){
    $.each(basicTableList,async function(k,v){
        if(list==undefined || list.includes(k)){
            await createTable(v.tablename,v.template,function(r){
                console.log('createTable '+v.tablename+" "+r);
            });
        }else{
            return;
        }
         
        
    })
}
function insertBasicDatabaseData(list){
    $.each(basicTableList,async function(k,v){
        if(list==undefined || list.includes(k)){
            await formatInsertData(k,v.data).forEach(async (data)=>{
                await insert(v.tablename,data,function(r){
                
                    console.log('insert '+v.tablename+" "+r);
                    console.log(data);
                });
            })
            
        }else{
            return false;
        }
         
        
    })
}
async function getBasicDatabaseData(list){
    const response = new Promise((resolve,reject)=>{
        var datas={};
        var count=-1;
        var dataSize=Object.keys(basicTableList).length;
        $.each(basicTableList,async function(k,v){
            count++;
            if(list==undefined || list.length==0 || list.includes(k)){
                
                var query="SELECT * FROM "+v.tablename+" ORDER BY id ASC";
                await fetch("http://"+ip+":"+port+"/select",{
                    headers:headers,
                    method: 'POST',
                    body: JSON.stringify({ query: query})
                })
                .then(response => response.json())
                .then(data => {
                    if(data['data'].length>0) {
                        datas[k]=formatDatabaseData(k,data['data'])

                        
                        var event = jQuery.Event( "dataLoaded" );
                        event.key = k;
                        event.value = formatDatabaseData(k,data['data']);
                        //console.log(event.value);
                        $('body').trigger(event);
                        if(k=='attorneys') {
                            var _event = jQuery.Event( "dataLoaded" );
                            _event.status = "completed";
                            _event.key = "completed";
                            _event.value = datas;
                            //console.log(datas);
                            //console.log(event.value);
                            $('body').trigger(_event);
                        }
                    }
                });
                
            }else{
                return;
            }
           
        })
        
        resolve(datas);
    });
    var data=await response;
    //res(data);
    //console.log(response);
    return data;

}
async function getBasic(template,list){
    const response = new Promise(async(resolve,reject)=>{
        await fetch("http://"+ip+":"+port+"/getBasic",{
            headers:headers,
            method: 'POST',
            body: JSON.stringify({ template: template,list:list})
        })
        .then(response => response.json())
        .then(data => {
            resolve(data);
        }).catch(err => {
            $().requestDialog({
                title:'提示',
                message:"似乎网络连接有问题...是否去检查连接？",
            },function(go){
                
            });
            console.log(err);
            
        });
        
    });
    return await response;
}
function getCaseDb(template,list,res) {
    const results = {};

    async function fetchData(k,v) {
        var query="SELECT * FROM "+v.tablename+" ORDER BY id ASC";
        await fetch("http://"+ip+":"+port+"/select",{
                        headers:headers,
                        method: 'POST',
                        body: JSON.stringify({ query: query})
                    })
                    .then(response => response.json())
                    .then(data => {
                        //console.log(`Data from ${k}:`, data.data);
                        //console.log(data);
                        if(data.hasOwnProperty('data')){
                            console.log(data.data);
                            results[k]=data.data;
                            //if(res!=undefined) res(k,data.data);
                        }
                    });
    }

    $.each(template, function(k,v){
        if(list==undefined || list.length==0 || list.includes(k)){
            fetchData(k,v);
        }else{
            return;
        }
    });

    return new Promise(resolve => {
        const intervalId = setInterval(() => {
        if (Object.keys(results).length === Object.keys(template).length) {
            clearInterval(intervalId);
            resolve(results);
        }
        }, 100);
    });
}
function formatInsertData(key,data){
    if(key=="caseStatus"){
        var _data=[];
        $.each(data,(i,element) => {
            if(element instanceof Array){
                
                $.each(element,(index,val)=>{
                    console.log(val);
                    _data.push({id:i+index/10,name:val,isMain:false});
                })
            }else{
                _data.push({id:i,name:element, isMain:true});
            }
        });
        return _data;
    }else if(key=="caseLabels"){
        var _data=[];
        count=0;
        $.each(data,(key,val) => {
            _data.push({id:count,label:key,labelStyle:JSON.stringify(val)});
            count++;
        });
        return _data;
    }else if(key=="caseTypes"||key=="caseCatelogs"||key=='caseCauses'||key=='caseReason'||key=='propertyStatus'||key=='counselTitles'){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,label:val});
        });
        return _data;
    }else if(key=="projects"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val});
        });
        return _data;
    }else if(key=="corporateCompanies"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val});
        });
        return _data;
    }else if(key=="corporatePartners"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val});
        });
        return _data;
    }else if(key=="legalAgencies"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val.name,authLevel:val.authLevel});
        });
        return _data;
    }else if(key=="legalCounsels"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val.name,contact:val.contact,title:val.title,institution:val.institution});
        });
        return _data;
    }
    else if(key=="attorneys"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val.name,contact:val.contact,title:val.title,lawFirm:val.lawFirm});
        });
        return _data;
    }
    else if(key=="lawFirms"||key=="legalInstitution"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,name:val});
        });
        return _data;
    }
    else if(key=="authLevels"){
        var _data=[];
        $.each(data,(index,val) => {
            _data.push({id:index,descriptions:val});
        });
        return _data;
    }
}
function formatDatabaseData(key,data){
    if(key=="caseStatus"){
        var _data=[];
        var _subData=[];
        $.each(data,(i,element) => {
            if(element.isMain){
                if(_subData.length>0){
                    _data.push(_subData);
                }
                _subData=[];
                _data.push(element);
                
            }else{
                _subData.push(element);
            }
        });
        return _data;
    }
    /*
    else if(key=="caseLabels"){
        var _data={};
        $.each(data,(i,element) => {
            _data[element.label]=JSON.parse(element.labelStyle);
        });
        return _data;
    }*/
    else{
        var _data=[];
        $.each(data,(i,element) => {
            _data.push(element);
        });
        return _data;
    }
}