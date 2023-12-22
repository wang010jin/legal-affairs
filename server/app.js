const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const dotenv = require('dotenv');
const $ = require("jquery");

const bodyParser = require('body-parser');
const formidable = require('formidable');
const busboy = require('busboy');
const multer = require('multer');
const ftp = require("basic-ftp");
const fs = require("fs");

const _ftp = require('ftp');

var iconv = require('iconv-lite');

const path = require('path');
const { env } = process;
dotenv.config({
    path: path.resolve(
        __dirname,
        `./env.${env.NODE_ENV ? env.NODE_ENV : "local"}`
      ),
});

const CryptoJS = require('crypto-js')

const keyStr = 'it@glory.com'
const ivStr = 'it@glory.com'

function encrypt(data, keyS, ivS) {
  let key = keyS || keyStr
  let iv = ivS || ivStr
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  const src = CryptoJS.enc.Utf8.parse(data)
  const cipher = CryptoJS.AES.encrypt(src, key, {
    iv: iv, // 初始向量
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7, // 填充方式
  })
  const encrypted = cipher.toString()
  return encrypted
}

function decrypt(data, keyS, ivS) {
  let key = keyS || keyStr
  let iv = ivS || ivStr
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  const cipher = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decrypted = cipher.toString(CryptoJS.enc.Utf8) // 返回的是加密之前的原始数据->字符串类型
  return decrypted
}

const DbService = require('./dbService');

var corsOptions = {
    origin: '*',
    credentials:true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions)).use((req,res,next)=>{
    console.log(req);
    res.setHeader('Access-Control-Allow-Origin',"*");
    next();
});
app.use(fileUpload({
    createParentPath: true,
    defParamCharset: "utf8" // 添加utf8编码
}));
//app.use(express.json());
//app.use(bodyParser.json());
//app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.get('/downloadLocal', (req, res) => {
  const fileName = decodeURIComponent(req.query.fileName);
  const folder = req.query.folder;
  //const filePath = 'uploads/国瑞信息软件表.xlsx';
  res.download(path.join(env.UPLOADS_PATH,folder,fileName), fileName, (err) => {
    if (err) {
      res.json({
        status:500,
        message:'Error downloading file '+fileName,
        error:err
      });
    }
  });
});
  app.get('/download', async (req, res) => {
    const client = new _ftp();
    const remoteFilePath = '/Downloads/1.xlsx';
    const localFilePath = './uploads/1.xlsx';

    await client.connect({
      host: "192.168.10.69",
      user: "FWdb\\administrator",
      password: "Glorypty@123",
  });

    client.on('ready', () => {
      client.get(remoteFilePath, (err, stream) => {
        if (err) {
          res.status(500).send('Error downloading file');
        } else {
          stream.pipe(fs.createWriteStream(localFilePath));
          stream.on('end', () => {
            res.download(localFilePath, '1.xlsx', (err) => {
              if (err) {
                res.status(500).send('Error downloading file');
              }
              client.end();
            });
          });
        }
      });
    });

    client.on('error', (err) => {
      res.status(500).send('Error connecting to FTP server');
    });
  });
  app.post('/uploadLocal', async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        //return res.status(400).send('No files were uploaded.');
        res.json({
          status:400,
          message:'No files were uploaded.',
        });
      }
  
      const file = req.files.file;
      const folder=req.body.folder;
      const  db= DbService.getDbServiceInstance();
      const result = db.uploadFileL(env.UPLOADS_PATH,folder,file);
      result
      .then(data => {
        console.log(folder);
        res.json(data);
      } )
      .catch(err => console.log(err));
      
    } catch (err) {
      console.error('Error handling file upload:', err);
      //res.status(500).send('Error handling file upload');
      res.json({
        status:500,
        message:'Error handling file upload',
        error:err
      });
    }
  });
  app.post('/upload', async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        //return res.status(400).send('No files were uploaded.');
        res.json({
          status:400,
          message:'No files were uploaded.',
        });
      }
  
      const file = req.files.file;
      const filePath=req.body.filePath;
      const  db= DbService.getDbServiceInstance();
      const result = db.uploadFile(filePath,file);
      result
      .then(data => {
        console.log(filePath);
        res.json(data);
      } )
      .catch(err => console.log(err));
      
    } catch (err) {
      console.error('Error handling file upload:', err);
      //res.status(500).send('Error handling file upload');
      res.json({
        status:500,
        message:'Error handling file upload',
        error:err
      });
    }
  });
// create
app.post('/insertUser',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {user} = request.body;
    const {pass} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.insertNewUser(user,pass);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.post('/insert',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {data} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.insertRow(table,data);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});
app.post('/pureinsert',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {data} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.insert(table,data);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.post('/insertAll',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {data} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.insertRows(table,data);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.post('/createTable',cors(corsOptions),(request,response) => {
    //console.log("request.body "+request.body.columns);
    const {columns} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.createTable(table,columns);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.post('/insertCase',(request,response) => {
    const {data} = request.body;
    const {template} = request.body;
    const results = [];
    //console.log(template,list);
    var tablekeys=Object.keys(template);
    var keys=Object.keys(data);
    var queries=[];
    tablekeys.forEach((tableKey)=>{
        var tableCols=Object.keys(template[tableKey].template);
        var values=[]
        var valuesKeys=[];
        var update=[];
        tableCols.forEach((tablecol)=>{
            if(keys.includes(tablecol)){
                var val=data[tablecol];
                //console.log(tablecol,template[tableKey].template[tablecol],template[tableKey].template[tablecol].toUpperCase().indexOf('INT'),val);
                if (template[tableKey].template[tablecol].toUpperCase().indexOf('INT')>-1){
                    if(val.constructor === String) val=parseInt(val.replace('"',''));
                    else val=val;
                } 
                else if (template[tableKey].template[tablecol].toUpperCase().indexOf('BOOL')>-1){
                    if(val.constructor === String) val=parseInt(val.replace('"',''));
                    else val=val;
                }
                else if (template[tableKey].template[tablecol].toUpperCase().indexOf('DATETIME')>-1 && val.length<19) val="\""+val+" 00:00:00\"";
                else val='"'+val+'"';
                update.push(tablecol+"="+val);
                values.push(val);
                valuesKeys.push(tablecol);
            }
        });
        queries.push("INSERT INTO `"+template[tableKey].tablename+"` ("+valuesKeys.join()+") VALUES ("+values.join()+") ON DUPLICATE KEY "+
            "UPDATE "+update.join()+";");
        //queries.push("REPLACE INTO `"+template[tableKey].tablename+"` ("+valuesKeys.join()+") VALUES ("+values.join()+");");
    });
    var counter=0;
    queries.forEach((q)=>{
        const db = DbService.getDbServiceInstance();
        const result = db.insertNewCase(q);
        result
        .then(data => {
            //console.log("in loop",k,data);
            results.push(data.success);
            counter++;
        })
        .catch(err => console.log(err));
    });

    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            //console.log('results',Object.keys(results).length);
        if (results.length === tablekeys.length) {
            clearInterval(intervalId);
            resolve(results);
            var isSuccess=true;
            results.forEach(r=>{
                if(!r) {
                    isSuccess=false;
                    return false;
                }
            })
            response.json({data:{success:isSuccess,}});
        }
        }, 100);
    });

});
app.post('/updateUser',(request,response) => {
  //console.log("request.body "+request.header('Content-Type'));
  const {data} = request.body;
  const {where} = request.body;
  const  db= DbService.getDbServiceInstance();
  var vals=[];
  if (data instanceof Object){
      var keys=Object.keys(data);
      if(keys.includes('_pass')&&data.hasOwnProperty('pass')) delete data.pass;
      keys.forEach((key)=>{
          vals.push(key+"=\""+data[key]+"\"");
          if(key=='_pass') vals.push("pass=\""+encrypt(data[key])+"\"");
      })
      data=vals.join();
  }
  const result = db.updateUser(where,data);
  result
  .then(data => response.json({data:data}) )
  .catch(err => console.log(err));
});
app.post('/update',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {data} = request.body;
    const {table} = request.body;
    const {where} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.update(where,table,data);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});
// read
app.get('/getAll',(request,response) => {
    const db = DbService.getDbServiceInstance();
    const result = db.getAllData();

    result
    .then(data => response.json({data:data}))
    .catch(err => console.log(err));

});
app.post('/select',(request,response) => {
    const {query} = request.body;
    const db = DbService.getDbServiceInstance();
    const result = db.select(query);

    result
    .then(data => response.json({data:data}))
    .catch(err => console.log(err));

});
app.post('/getBasic',(request,response) => {
    const {template} = request.body;
    const {list} = request.body;
    const results = {};
    //console.log(template,list);
    var keys=Object.keys(template);
    keys.forEach((k)=>{
        if(list==undefined || list.length==0 || list.includes(k)){
            //console.log();
            
            const db = DbService.getDbServiceInstance();
            const result = db.getBasic(template[k]);
            result
            .then(data => {
                //console.log("in loop",k,data);
                results[k]=data;
            })
            .catch(err => console.log(err));
            
        }else{
            return;
        }
    });

    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            //console.log('results',Object.keys(results).length);
        if (Object.keys(results).length === Object.keys(template).length ||
        (list.length>1 && Object.keys(results).length==list.length)) {
            clearInterval(intervalId);
            //console.log('results',results);
            resolve(results);
            response.json({data:results});
        }
        }, 100);
    });

});

// create
app.post('/login',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {name} = request.body;
    const {pass} = request.body;
    
    const  db= DbService.getDbServiceInstance();
    const result = db.login(name,encrypt(pass));
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

// update


// delete
app.post('/delete',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {id} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.removeRow(id,table);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});
app.post('/deleteRows',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {ids} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.removeRows(ids,table);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});
app.post('/inactiveCases',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {ids} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.constrolRows(ids,1);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});
app.post('/restoreCases',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {ids} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.constrolRows(ids,0);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});
app.post('/inactiveItem',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {where} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.constrolItem(where,table,1);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});
app.post('/restoreItem',(request,response) => {
    //console.log("request.body "+request.header('Content-Type'));
    const {where} = request.body;
    const {table} = request.body;
    const  db= DbService.getDbServiceInstance();
    const result = db.constrolItem(where,table,0);
    result
    .then(data => response.json({data:data}) )
    .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log('app is runing at port: '+process.env.PORT))