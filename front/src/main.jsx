import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Profile from "./Pages/Profile.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
        <Route path="profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>
)