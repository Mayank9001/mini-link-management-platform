import React, { useState } from 'react';
import './App.css'
import { ToastContainer, Bounce } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Links from './pages/Links';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <>
    <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={false} closeButton={false} newestOnTop closeOnClick={false} rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="colored" transition={Bounce} />
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/links' element={<Links />} />
          <Route path='/analytics' element={<Analytics />}/>
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </Router>
    </>
  )
};

export default App
