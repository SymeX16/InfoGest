import React from 'react'
import LoginComp from './LoginComp';
import RegisterComp from './RegisterComp';
import InternerComp from './InternerComp';


export default function Home() {

    // modus 0 start || 1 = anmeldung || 2 Registrierung|| 3 intern
    const [mode, setMode] = React.useState(0);
    const [userId, user] = React.useState(-1);
    const [userNick, setNick] = React.useState("");


    function setName(value) {
        setNick(value)
        console.log(userNick)
    }

    function setUser(value) {
        user(value);
        console.log(userId)
    }

    function buttonhandlerHome() {
        setMode(0);
        setUser(-1);
        setNick("")
    }

    function buttonhandlerLogin() {
        setMode(1)
        setUser(-1);
        setNick("")
    }

    function buttonhandlerRegister() {
        setMode(2)
    }


   


    if (mode === 0) {
        return (
            <div className="homeBody">  
                <h1>Hallo und wilkommen zur app

                </h1>
                 <button onClick={buttonhandlerLogin}> Login</button>
                 <button onClick={buttonhandlerRegister}> Register</button>
               
            </div>
        )
    }
    if (mode === 1) {

        return (

            <>
                <div className="login">
                    <LoginComp setEnde={setMode} userId={setUser} userNick={setName}
                               buttonhandlerRegister={buttonhandlerRegister}/>
                </div>

            </>
        )
    }
    if (mode === 2) {
        return (
            <>
                <div className="register">
                    <RegisterComp setEnde={setMode} buttonhandlerHome={buttonhandlerHome}
                                  buttonhandlerLogin={buttonhandlerLogin}/>
                </div>
            </>
        )
    }
    if (mode === 3 && userId !== -1 && userNick !== "") // hier noch das interne checken
    {
        
        return (
            <div className="internerComp">
               { <InternerComp userNick={userNick} userId={userId} gohome={buttonhandlerHome} setId={setUser}/>
 }
    </div>
        )
    }
   
}
