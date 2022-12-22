import React from 'react';
import './App.css';
import Signup from './Components/Authentication/signup';
import Login from './Components/Authentication/login';
import Dashboard from './Components/dashboard';
import {
  BrowserRouter,
  Routes,
  Route,
  
} from "react-router-dom";

function App() {
  return (
    <div className="App App-header">
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup/*" element={<Signup />} />
        <Route path="login/*" element={<Login />} />
        <Route path="dashboard/*" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
         
    </div>
  );
}

export default App;
