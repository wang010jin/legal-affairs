/*
document.addEventListener('DOMContentLoaded',function(){
    fetch('http://'+ip+':'+port+'/getAll')
    .then(response => response.json())
    .then(data => loadHTML(data['data']));
});
*/
const log = document.getElementById("debug");
const message = document.getElementById("message");
const addBut = document.getElementById("addBut");

const nameInput = document.getElementById("user");
const passInput = document.getElementById("password");
$('#loadingLogo').attr('src',logoSrc)
//console.log(sessionStorage.getItem("currentUser"),sessionStorage.getItem("currentUser").name!=undefined);
try{
    if(JSON.parse(sessionStorage.getItem("currentUser")).name!=undefined){
        window.location.href = mainPage;
    }
}catch(e){
    console.log('需要重新登录')
}

const loginBut = document.getElementById("loginBut");
loginBut.onclick = async function (){
    const name = nameInput.value;
    const pass = passInput.value;
    //nameInput.value="";
    //alert(name);
    if (IsLoginVaild()){

        await fetch("http://"+ip+":"+port+"/login",{
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ name: name, pass: pass})
        })
        .then(response => response.json())
        .then(data => login(data['data']));
    }else{
       // message.innerHTML=Message.LOGIN_IS_EMPTY;
    }
    
}

function insertRowIntoTable(data){
    console.log(data.success);
}
function login(data){
    //console.log(data.data[0].name);
    if(data.success){
        //message.innerHTML=formatString(Message.LOGIN_WELCOME_F,JSON.parse(data.data).name);
        //console.log(data);
        //data.data['_pass']=data.pass;
        sessionStorage.setItem("currentUser", data.data);
        //console.log(JSON.parse(sessionStorage.getItem("currentUser")).name+"--"+data.data);
        $('.loginPanel').animate({opacity:0,height:0},1000,function(){

            window.location.href = mainPage;
        })
    }else{
        //message.innerHTML=Message.LOGIN_ISNOT_MATCH;
        $().minfo('show',{title:"错误",message:"请检查您的密码或用户名！"},function(){
        });
    }
}
$(nameInput).on("change keyup", (event) => {
    $(nameInput).tooltip('hide');
});
$(passInput).on("change keyup",(event) => {
    $(passInput).tooltip('hide');
});
function IsLoginVaild(){
    const name = nameInput.value;
    const pass = passInput.value;
    if(name == ""){
        
        $(nameInput).tooltip('show',"用户名不能为空")
    }else if(pass == ""){
        $(passInput).tooltip('show',"密码不能为空")
    }
    return name != "" && pass != "";
}

$(document).keyup(function(event){  
    if(event.key === 'Enter'){  
        $(loginBut).trigger('click');
    }  
  });   

//console.log(JSON.stringify(columns));
/*
fetch("http://"+ip+":"+port+"/createTable",{
    headers:{
        'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ table: "cases", columns:columns})
})
.then(response => response.json())
.then(data => {console.log(data);});
*/