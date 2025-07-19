import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './folder/components/Login'
import ChatRoom from './folder/components/ChatRoom'
import ProtectedRoute from './folder/components/ProtectedRoute'
import { AuthProvider } from './folder/components/AuthContext';

const App = ()=>{
  return(
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/chatroom" element={
          <ProtectedRoute>
            <ChatRoom/>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
    </AuthProvider>
  )
}
export default App
