import { useState } from 'react'
import './App.css'
import Login from "./Features/Login/Login.jsx";
import TestAuth from "./Features/TestAuthToken/TestAuthToken.jsx";

function App() {
  return (
    <>
      <Login />
      <TestAuth />
    </>
  )
}

export default App
