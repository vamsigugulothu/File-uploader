
import './App.css';
import { useState, useEffect } from "react";
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import 'firebase/compat/auth';
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
