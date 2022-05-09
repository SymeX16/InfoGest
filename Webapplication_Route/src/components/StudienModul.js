import React from 'react'

export default function StudienModul({value}) {
    var Minio = require("minio");
    var minioClient = new Minio.Client({
      endPoint: "141.56.132.18",
      port: 9000,
      useSSL: false,
      accessKey: "admin",
      secretKey: "hgjkrwehg46782h87z",
    });
    
    function start() {
      var arr = [];
      minioClient.getObject(
        "status",
        "studiengang.json",
        function (err, dataStream) {
          if (err) {
            return console.log(err);
          }
          dataStream.on("data", function (chunk) {
            arr.push(chunk);
          });
          dataStream.on("end", function () {
            var all=JSON.parse(arr.toString()).studiengang[0]  
            all.module.map((mod)=>{
                
                if(`${mod.modulnummer}`===`${value}`){
                    setModName(mod.modul)
                    setModCredit(mod.credits)
                }
            })
          });
        }
      );
    }
    React.useEffect(() => {
      start();
    }, []);
  
   function test(){
       console.log(modName)
   }

    const [modName,setModName]=React.useState("")
    const [modCredit,setModCredit]=React.useState("")
  
  
    if(value!==null){return (
    <div >{`${modName}`}<br/>Credits:{` ${modCredit}`}</div>
  )}else{return (null)}
}
