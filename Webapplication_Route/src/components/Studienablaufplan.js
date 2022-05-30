import React from "react";
import "./Studienablaufplan.css";
import Card from "@mui/material/Card";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import StudienModul from "./StudienModul";

export default function Studienablaufplan({modulButtonHandler}) {
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
            setStudiengang(JSON.parse(arr.toString()).studiengang[0]);
        });
      }
    );
  }
  React.useEffect(() => {
    start();
    console.log(studiengang)
  }, []);

  const [studiengang,setStudiengang]=React.useState(null)

  const columns = [
    { field: 'modId', headerName: 'modId', type:"object",sortable: false,
    width: 160,
    },
    { field: 'Semester_1', headerName: 'Semester_1', type:"object", width: 270 ,sortable: false,
    renderCell: (params) => (
        <p>
           
          <StudienModul modulButtonHandler ={modulButtonHandler} value={params.value}></StudienModul>
        </p>
      ),
   
    },
    { field: 'Semester_2', headerName: 'Semester_2', width: 270 ,sortable: false,
    renderCell: (params) => (
        <p>
          
          <StudienModul  modulButtonHandler ={modulButtonHandler} value={params.value}></StudienModul>
        </p>
      ),
    },
    { field: 'Semester_3', headerName: 'Semester_3', width: 270 ,sortable: false,
    renderCell: (params) => (
        <p>
          
          <StudienModul  modulButtonHandler ={modulButtonHandler} value={params.value}></StudienModul>
        </p>
      ),
   },
    {field: 'Semester_4', headerName: 'Semester_4',width: 270,sortable: false,
    renderCell: (params) => (
        <p>
          
          <StudienModul  modulButtonHandler ={modulButtonHandler} value={params.value}></StudienModul>
        </p>
      ),
    },
    {field: 'Semester_5',headerName: 'Semester_5',width: 270,sortable: false,
    renderCell: (params) => (
        <p>
         
          <StudienModul modulButtonHandler ={modulButtonHandler} value={params.value}></StudienModul>
        </p>
      ),
    },
  ];
  const [row,setRow]=React.useState([]);
 
  React.useEffect(() => {
   if(studiengang===null)return;
   var r=[]
    studiengang.module.map((mod,key)=>{
        
        // eslint-disable-next-line default-case
        switch(mod.semester){
              case 1:
                r.push( { id: key+1, "modId":mod.modulnummer, "Semester_1":mod.modulnummer, "Semester_2":null,"Semester_3":null ,"Semester_4":null ,"Semester_5":null  }    )
              break;
              case 2:
                r.push( { id: key+1, "modId":mod.modulnummer, "Semester_1":null, "Semester_2":mod.modulnummer,"Semester_3":null ,"Semester_4":null ,"Semester_5":null  }    ) 
              break;
              case 3:
                r.push( { id: key+1, "modId":mod.modulnummer, "Semester_1":null, "Semester_2":null,"Semester_3":mod.modulnummer ,"Semester_4":null ,"Semester_5":null  }    ) 
              break;
              case 4:
                r.push( { id: key+1, "modId":mod.modulnummer, "Semester_1":null, "Semester_2":null,"Semester_3":null ,"Semester_4":mod.modulnummer ,"Semester_5":null  }    )     
              break;
              case 5:
                r.push( { id: key+1, "modId":mod.modulnummer, "Semester_1":null, "Semester_2":null,"Semester_3":null ,"Semester_4":null ,"Semester_5":mod.modulnummer  }    )     
              break;
        }
    })
    console.log(r)
    setRow(r);
  }, [studiengang]);

  var rows = [
    { id: 1, modId:"E802", Semester_1:"E802", Semester_2:null,Semester_3:null ,Semester_4:null ,Semester_5:null  },
   
  ];

  if(studiengang===null)return(<></>)
else
  return (
    <Card>
        <div>
            <p>{studiengang.sgNummer}</p>
            <p>{studiengang.sgName}</p>
            <p>{studiengang.sgRegelstudienzeit}</p>
            <p>{studiengang.sgCredits}</p>
        </div>
      
      <div style={{ height: 650, width: '100%' }}>
      <DataGrid
        rows={row}
        columns={columns}
       
      />
    </div>
    </Card>
  );
}
