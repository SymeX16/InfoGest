import React from 'react'

export default function RegisterComp({setEnde, buttonhandlerHome, buttonhandlerLogin}) {
    
    
    var Minio = require('minio')
    var minioClient = new Minio.Client({
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: 'admin1',
        secretKey: 'password'
    })


    function upload(u) {

        var t = "{\"user\":" + JSON.stringify(u) + "}"
        minioClient.putObject('status', 'data.json', t, t.size, function (err, objInfo) {
            if (err) {
                return console.log(err) // err should be null
            }
            console.log("Success", objInfo)
        })
    }


    function hashing(pepper) {
        var salt = "dkgtsmhtebankmencrtiohcaik"

        var sha512 = require('js-sha512');
        return sha512(pepper+salt)
        
    }

    const [user, setUser] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [passwort, setPass] = React.useState("");
    const [passwortWDH, setPassWDH] = React.useState("");
    const [hashpassword, setHashPw] = React.useState("");
    const [zugriff, setZugriff] = React.useState("");   //Hallo-108648891
    const [zugriffsLabel, setZL] = React.useState("");
    const [passwordLabel, setPWL] = React.useState("")
    const [errors, setErrors] = React.useState("")
    const [nutzergruppe, setNG] = React.useState("")
    const [step, setStep] = React.useState(0);
    const [recover, setRecover] = React.useState(0);
    const [userRecovery, setUserRecovery] = React.useState(0);


 

    function userInput(value) {

        var arr = [];
        minioClient.getObject('status', 'data.json', function (err, dataStream) {
            if (err) {
                return setErrors("Failed to connect to server!")
            }
            dataStream.on('data', function (chunk) {
                arr.push(chunk)
            })
            dataStream.on('end', function () {

                var reg = JSON.parse(arr.toString()).user
                var te = true
                reg.map((u) => {
                    if (u.username.toLowerCase() === value.toLowerCase()) {
                        te = false;
                    }
                })
                if (te) {
                    setErrors("");
                    document.getElementsByClassName("registerSubmitButton")[0].disabled = false;

                } else {
                    setErrors("Username already taken!");
                    document.getElementsByClassName("registerSubmitButton")[0].disabled = true;
                }

            })
        })

        setUser(value);
    }

    function emailInput(value) {
        setEmail(value);
    }

    function passInput(value) {
        setPass(value);
        if (`${value}` === `${passwortWDH}`) {
            setHashPw(hashing(value));
            setPWL("");
        } else (setPWL("Passwords do not match!"))
    }

    function passwdhInput(value) {
        setPassWDH(value);
        if (`${value}` === `${passwort}`) {
            setHashPw(hashing(value));
            setPWL("");
        } else (setPWL("Passwords do not match!"))
    }

    function registrieren(){
        var arr = [];
            minioClient.getObject('status', 'data.json', function (err, dataStream) {
                if (err) {
                    return setErrors("Failed to connect to server!")
                }
                dataStream.on('data', function (chunk) {
                    arr.push(chunk)
                })
                dataStream.on('end', function () {

                    var reg = JSON.parse(arr.toString()).user
                    var te = true
                    reg.map((u) => {
                        if (u.username.toLowerCase() === user.toLowerCase()) {
                            te = false;
                        }
                    })
                    console.log(te)
                    if (te) {
                        var newid = getId(reg)
                        var ob = {
                            username: user,
                            email: email,
                            Nutzergruppe: nutzergruppe,
                            passwort: hashpassword,
                            id: newid
                        }
                        reg.push(ob);
                        upload(reg);
                        console.log(reg);
                        setEnde(1);
                    } else {
                        setUserRecovery(0);
                        setStep(0);
                        setErrors("Username already taken!");
                    }

                })
            })
    }

    function getId(u) {
        var id = 1;
        var ident = 1
        while (ident === 1) {
            ident = 0
            for (var i = 0; i < u.length; i++) {
                if (u[i].id === id) {
                    id++;
                    ident = 1
                }
            }
        }
        return id;
    }

    function submitHandler() {
        if (`${user}`.length > 0 && `${email}`.length > 0 && `${passwort}`.length > 0 && `${passwordLabel}` === "" && `${nutzergruppe}` !== "") {
            
            registrieren()

        } else {
            setErrors("Check the parameters!");
        }

    }

    function getNutzGruppe() {
        var select = document.getElementById("list").value
        console.log(select);
        setNG(select)
        console.log(nutzergruppe);
    }

        return (
            <div className="registerMain">
                <div>
                    <h1 className="registerH1">Registration</h1>
                </div>

                <div className="registerInput">
                    <label>Username</label>
                    <input
                        className="registerUserIN"
                        type="text"
                        value={user}
                        placeholder="Username"
                        onChange={e => userInput(e.target.value)}/>
                </div>
                <div className="registerInput">
                    <label>E-Mail</label>
                    <input
                        className="registerEmailIN"
                        type="text"
                        value={email}
                        placeholder="someone@mail.com"
                        onChange={e => emailInput(e.target.value)}/>
                </div>
                <div className="registerInput">
                    <label>User Group</label>
                    <div className="auswahl">
                        <select className="registerList" id="list" onChange={getNutzGruppe}>
                            <option value="">Choose</option>
                            <option value="Allgemeiner_Nutzer">all User</option>
                            <option value="Lehrer_Nutzer">lehrer User</option>
                            <option value="Admin_Nutzer">admin User</option>
                        </select>
                    </div>
                </div>
                <div className="registerInput">
                    <label>Password</label>
                    <input
                        className="registerPassIN"
                        type="password"
                        value={passwort}
                        placeholder="Password"
                        onChange={e => passInput(e.target.value)}/>
                </div>
                <div className="registerInput">
                    <label>Repeat Password</label>
                    <input
                        className="registerPassWdhIN"
                        type="password"
                        value={passwortWDH}
                        placeholder="Password"
                        onChange={e => passwdhInput(e.target.value)}/>
                    <label className="registerErrorLabel">{passwordLabel}</label>
                </div>
                <label className="registerErrorLabelFormular">{errors}</label>

                <button className="registerSubmitButton" onClick={submitHandler}>Submit</button>

                <div className="App">
                </div>
                <div>
                    <div>
                        <label className="registerLoginLabel">Already registered?</label>
                        <button className="registerLoginButton" onClick={buttonhandlerLogin}>Log In</button>
                    </div>
                </div>

            </div>
        )
}
