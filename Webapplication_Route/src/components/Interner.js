import React from "react";
import Studienablaufplan from "./Studienablaufplan";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";



export default function Interner({ userNick, userId,setModul}) {
  var Minio = require("minio");
  var minioClient = new Minio.Client({
    endPoint: "141.56.132.18",
    port: 9000,
    useSSL: false,
    accessKey: "admin",
    secretKey: "hgjkrwehg46782h87z",
  });
  const navigate = useNavigate();

  const [userData, setUserData] = React.useState(null);
  const [moduls, setModuls] = React.useState([]);

  const [time, setTime] = React.useState(Date.now());

  const deadLineList = moduls.map((item) =>
    item.deadlines.map((dead) => (
      <ul>
        {dead.name}:{dead.doDatum}
      </ul>
    ))
  );

  function modulButtonHandler(mod){
    setModul(mod);
    navigate("/modul")
  }
  //setModul
  const modulList = moduls.map((item) => 
  <button value={item.modulId} onClick={(e)=>modulButtonHandler(e.target.value)}>{item.modulName}</button>);
  //news
  const newsList = moduls.map((item) => 
  (item.news.map((n) =>(
    <ul><label>{n.name+" "+n.expiryDate}</label></ul>)
  )));
  //noten
  const gradesList = moduls.map((item) => 
  (item.grades.map((g) =>(
    g.studentID===`${userData.id}`?
    <ul><label>{"Modul:"+item.modulName+"->"+g.name+"\nGrade:"+g.grade}</label></ul>:null)
    )));
  //schedule
  const scheduleList = moduls.map((item) => 
  (item.schedule.map((s) =>(
    <ul><label>{"Modul:"+item.modulName+" Room: "+s.room+"\nTime: "+s.time+"\nDOF: "+s.dof+"\nWeek:"+s.week+"\nType: "+s.type}</label></ul>))
  ));


  function start() {
    var arr = [];
    var arr2 = [];
    setModuls([]);
    
    minioClient.getObject("status", "data.json", function (err, dataStream) {
      if (err) {
        return console.log(err);
      }
      dataStream.on("data", function (chunk) {
        arr.push(chunk);
      });
      dataStream.on("end", function () {
        //  console.log(arr.toString())
        var u = JSON.parse(arr.toString()).user;
        //   console.log("Redy")

        for (var i = 0; i < u.length; i++) {
          if (u[i].id === userId) {
            setUserData(u[i]);
          
            var use = u[i];
            // eslint-disable-next-line no-loop-func
            minioClient.getObject("status","modul.json",function (err, dataStream) {
                if (err) {
                  return console.log(err);
                }
                dataStream.on("data", function (chunk) {
                  arr2.push(chunk);
                });
                dataStream.on("end", function () {
                  var m = JSON.parse(arr2.toString()).module;
                  for (var c = 0; c < m.length; c++) {
                   try{
                    if (use.module.indexOf(m[c].modulId) > -1) {
                      console.log(m[c].modulId + m[c].modulName)
                      var tmp = moduls;
                      tmp.push(m[c]);
                      setModuls(tmp);
                    }}catch{console.log("leeres Modul")}
                  }
                });
              }
            );
          }
        }
      });
    });
  }
  React.useEffect(() => {
    start();
    console.log(moduls);
  }, []);
  React.useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  });


  function back() {
    navigate("/");
  }

  // eslint-disable-next-line no-lone-blocks

  if (userNick !== "")
    return (
      <>
        <div className="internContainer">
          <h1>Interner bereich von {userNick}</h1>
          <button onClick={back}></button>
        <div>
        <Studienablaufplan  modulButtonHandler ={modulButtonHandler}></Studienablaufplan>
        </div>

          <div className="deadlinesContainer">
            <h3>Deadlines</h3>
            <ul>{deadLineList}</ul>
          </div>
          <div className="newsContainer">
          <h3>News</h3>
            <ul>{newsList}</ul>
          </div>
          <div className="gradeContainer">
          <h3>Grades</h3>
            <ul>{gradesList}</ul>
          </div>

          <div className="gradeContainer">
          <h3>Stundenplantermine und so</h3>
            <ul>{scheduleList}</ul>
          </div>

          <div className="modulContainer">
            <ul>{modulList}</ul>
          </div>
        </div>
      </>
    );
  else
    return (
      <div>
        Bitte richtig anmelden
        <button onClick={back}>Home</button>
      </div>
    );
}
