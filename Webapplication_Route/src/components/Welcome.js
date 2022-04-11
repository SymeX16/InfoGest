import React from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div>
      <div>Welcome to the App</div>

      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
}
