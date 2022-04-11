import React from "react";
import Login from "./Login";
import Register from "./Register";
import Interner from "./Interner";
import Welcome from "./Welcome";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

export default function Home() {
  // modus 0 start || 1 = anmeldung || 2 Registrierung|| 3 intern
  
  const [userId, user] = React.useState(-1);
  const [userNick, setNick] = React.useState("");

  function setName(value) {
    setNick(value);
    console.log(userNick);
  }

  function setUser(value) {
    user(value);
    console.log(userId);
  }


  return (
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li>
                <Link to="/login">login</Link>
                
            </li>
            <li>
                <Link to="/register">register</Link>
                
            </li>
            <li>
                <Link to="/intern">intern</Link>
            </li>
            <li>
                <Link to="/">home</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Routes>
         
        <Route path="/" element={<Welcome/>}>
        </Route>
  
         
        <Route path="/login" element={<Login userId={setUser} userNick={setName}
                              />}>
        </Route>
        <Route path="/register" element={<Register/>}>
        </Route>
        <Route path="/intern" element={<Interner userNick={userNick} userId={userId}/>}>
        </Route>
      </Routes>
    </Router>
  );
}
