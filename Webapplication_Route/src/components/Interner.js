import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link ,useNavigate} from "react-router-dom";


export default function Interner({ userNick, userId}) {
const navigate=useNavigate();
    function back(){
        navigate("/");
}
        
        // eslint-disable-next-line no-lone-blocks
        {if  (userNick!=="") 
        return (<>
            <div className="internContainer">
                <h1>Interner bereich von {userNick}</h1>
                <button onClick={back}></button>
            </div>
        </>)
    else return(<div>Bitte richtig anmelden
        <button onClick={back}>Home</button>
    </div>)    
    }
}
