const http = require("http");
const fs = require('fs');
const _ = require("lodash");
let server = http.createServer(function (req, res) {
    let buffer = '';
    req.on('data',function(chunk){
        buffer += chunk;
    });
    req.on('end',()=>{
        let data = fs.readFileSync('data.json','utf-8')  ;
        data = JSON.parse(data);
        if(buffer.length !== 0) buffer = JSON.parse(buffer);
    if(req.method.toLowerCase() === 'post') postData(data , buffer , res); 
    else if(req.method.toLowerCase() == 'delete') deleteData(data , buffer , res);
    else if(req.method.toLowerCase() == 'put') putData(data,buffer,res);
    else{
        res.writeHead(200, 'ok',{'Content-Type': 'application/json'});
        data= JSON.stringify(data);
        res.write(data);
        res.end("\nend of data");
      }
      });
    }
);
server.listen(3000,()=>{
  console.log("listening to server");
});
function postData(data,buffer,res){
    try{
        // console.log(postVerify(buffer,data));
        if(!postVerify(buffer,data)) throw 'bad request';
            data.push(buffer);
            data = JSON.stringify(data);
            fs.writeFileSync('data.json',data);
            res.writeHead(200, 'ok' , {'Content-Type': 'application/json'});
            res.end("\n end of data");
    }catch(err){
     res.writeHead(400, 'bad request',{'Content-Type': 'application/text'});
     res.end("bad request");
    }
}
function deleteData(data,buffer , res){
    if(_.findIndex(data,{id:buffer.id}) != -1){
        console.log("inds");
        data.splice(_.findIndex(data,{id:buffer.id}),1);
        data= JSON.stringify(data);
        fs.writeFileSync('data.json',data);
        res.end("delete done");
    }else{
        res.end("id not found");
    }
}
function putData(data,buffer , res){
    if(_.findIndex(data,{id:buffer.id}) != -1){
        for(let key in data[_.findIndex(data,{id:buffer.id})])
        data[_.findIndex(data,{id:buffer.id})][key] = buffer[key];
       data = JSON.stringify(data);
       fs.writeFileSync('data.json',data);
       res.end("put done");
    }else{
        res.end("id not found");
    }
}
function postVerify(buffer, b){
    let keys = Object.keys(buffer);
    if(
        keys.includes("id") &&
        keys.includes("emp_name") &&
        keys.includes("emp_salary") &&
        keys.includes("emp_age") &&
        keys.length === 4 &&
        Number(buffer.id) > 0 &&
        Number(buffer.emp_age) > 0 &&
        _.findIndex(b, { id: buffer.id }) === -1
    ) {
        return true;
    } else {
        return false;
    }
}