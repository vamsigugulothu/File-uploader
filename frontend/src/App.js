
import './App.css';
import { useState, useEffect } from "react";
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import 'firebase/compat/auth';
import Main from './pages';
import Dashboard from './pages/Dashboard';


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
