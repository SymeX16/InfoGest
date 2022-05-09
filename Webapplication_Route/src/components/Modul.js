import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

export default function Modul({ userId,modul }) {
  const navigate = useNavigate();
  function backHandler() {
    navigate("/intern");
  }
  var Minio = require("minio");
  var minioClient = new Minio.Client({
    endPoint: "141.56.132.18",
    port: 9000,
    useSSL: false,
    accessKey: "admin",
    secretKey: "hgjkrwehg46782h87z",
  });

  const [mod, setMod] = React.useState([]);
  const [time, setTime] = React.useState(Date.now());
  const [dead, setDead] = React.useState([]);
  const [anwendungen, setAnwendungen] = React.useState([]);
  const [news,setNews]= React.useState([]);
  const [grades,setGrades]=React.useState([]);
  const [schedule,setSchedule]=React.useState([]);

  function start() {
    console.log("satrt"+modul)
    var arr = [];
    minioClient.getObject("status", "modul.json", function (err, dataStream) {
      if (err) {
        return console.log(err);
      }
      dataStream.on("data", function (chunk) {
        arr.push(chunk);
      });
      dataStream.on("end", function () {
        var m = JSON.parse(arr.toString()).module;
        for (var c = 0; c < m.length; c++) {
          if (m[c].modulId === modul) {
            setMod(m[c]);
            setAnwendungen(m[c].usedModules)
            setDead(m[c].deadlines)
            setGrades(m[c].grades)
            setNews(m[c].news)  
            setSchedule(m[c].schedule)
          }
        }
      });
    });
  }
  React.useEffect(() => {
    start();
  //  console.log(modul);
  }, []);
  const deadLineList =dead.map((dead) => (
    <ul>{dead.name}:{dead.doDatum}</ul>))
  
    const Anwendungsliste =anwendungen.map((list) => (
    <ul><button>{list.id}:{list.name}:{list.spezificationNumber}</button></ul>))

    const newsList =news.map((n) => (
    <ul><label>{n.name+" "+n.expiryDate}</label></ul>))

    const scheduleList =schedule.map((s) => (
      <ul><label>{"Room: "+s.room+"\nTime: "+s.time+"\nDOF: "+s.dof+"\nWeek:"+s.week+"\nType: "+s.type}</label></ul>))
  
      const gradeList =grades.map((g) => (
        <ul><label>{g.name+": "+g.grade+"->"+g.studentID+" ["+g.datum+"]"}</label></ul>))  
  React.useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
      
     
    };
  })

    

  // eslint-disable-next-line no-lone-blocks
  {
    if (mod === null)
      return (
        <div>
          <h1>please wait</h1>
        </div>
      );
    else
      return (
        <div className="modulContainer">
          <div className="AlgemeineInfos">
            <h1>{mod.modulId}{"    "}{mod.modulName}</h1>
            <h2>{"Leiter  "}{mod.leader}</h2>
            <h2>{"Email  "}{mod.leaderMail}</h2>
          </div>
          <div className="deadlinesContainer">
            <h3>DeadLines</h3>
            <ul>{deadLineList}</ul>
          </div>
          
          <div className="NewsContainer">
          <h3>News</h3>
            <ul>{newsList}</ul>
          </div>
          <div className="scheduleContainer">
          <h3>Schedule</h3>
            <ul>{scheduleList}</ul>
          </div>
          <div className="gradeContainer">
          <h3>Grade</h3>
            <ul>{gradeList}</ul>
          </div>
          <div className="AnwendungsContainer">
            <ul>{Anwendungsliste}</ul>
          </div>
          <div>
            <button onClick={backHandler}>back</button>
            
          </div>
        </div>
      );
  }
}
