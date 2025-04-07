import React from 'react'
import "./index.css"
import { Route,Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import EmailVerified from './Pages/EmailVerified'
import ResetPassword from './Pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div >
      <ToastContainer/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/email-verify" element={<EmailVerified/>} />
      <Route path="/reset-password" element={<ResetPassword/>} />
    </Routes>
    </div>
  )
}

export default App