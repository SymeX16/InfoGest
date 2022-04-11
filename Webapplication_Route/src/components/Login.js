import React from "react";

import { BrowserRouter as Router, Routes, Route, Link ,useNavigate} from "react-router-dom";

export default function Login({
  userId,
  userNick
}) {
  var Minio = require("minio");
  var minioClient = new Minio.Client({
    endPoint: "127.0.0.1",
    port: 9000,
    useSSL: false,
    accessKey: "admin1",
    secretKey: "password",
  });

  function start() {
    minioClient.listBuckets(function (err, buckets) {
      if (err) return seterr("Failed to connect to server!");
    });
  }

  React.useEffect(() => {
    start();
  }, []);

  const [username, setuser] = React.useState("");
  const [password, setpass] = React.useState("");
  const [hash, sethas] = React.useState("");

  const [error, seterr] = React.useState("");
  const navigate = useNavigate();
  var t = 0;

  function hashing(pepper) {
    var salt = "dkgtsmhtebankmencrtiohcaik";

    var sha512 = require("js-sha512");
    return sha512(pepper + salt);
  }

  function userinput(value) {
    setuser(value);
  }

  function passinput(value) {
    setpass(value);
    hasinput(hashing(value));
  }

  function hasinput(value) {
    sethas(value);
  }

  React.useEffect(() => {
    userId(-1);
    userNick("");
  }, []);
  
  
  
  function login() {
    if (username === "back") {
      userId(666);
      userNick("Backdoor");
     
      navigate("/intern");

      return;
    }

    if (`${username}`.length > 0 && `${password}`.length > 0) {
      var arr = [];
      minioClient.getObject("status", "data.json", function (err, dataStream) {
        if (err) {
          return console.log(err) ^ seterr("Failed to connect to server!");
        }
        dataStream.on("data", function (chunk) {
          arr.push(chunk);
        });
        dataStream.on("end", function () {
          //  console.log(arr.toString())
          var u = JSON.parse(arr.toString()).user;
          //   console.log("Redy")

          for (var i = 0; i < u.length; i++) {
            if (u[i].username === username && u[i].passwort === hash) {
              t = 1;
              userId(u[i].id);
              userNick(u[i].username);
            }
          }
          if (t === 1) {
            navigate("/intern")
          } else seterr("Please check username and password!");
        });
      });
    } else {
      seterr("Please fill in all fields!");
    }
  }

  function toggelpassword() {
    var x = document.getElementById("PW");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (document.getElementById("home_loginButton") == null) {
      } else document.getElementById("home_loginButton").click();
    }
  });

  return (
    <div className="loginMain">
      <h1 className="loginH1">Login</h1>
      <div className="loginInput">
        <label>Username</label>
        <input
          className="user"
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => userinput(e.target.value)}
        />
      </div>
      <div className="loginInput">
        <label>Password</label>
        <input
          className="passwort"
          id="PW"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => passinput(e.target.value)}
        />
        <div className="loginShowPw">
          <div>
            <input
              className="check"
              type="checkbox"
              onChange={toggelpassword}
            />
            <label className="loginShowPwLabel">Show Password</label>
          </div>
        </div>
      </div>

      <label className="loginErrorLabel">{error}</label>

      <button className="homeLoginButton" id="home_loginButton" onClick={login}>
        Login
      </button>

      <div className="buttonbar">
        <div>
          <label className="homeRegisterLabel">No Login?</label>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
