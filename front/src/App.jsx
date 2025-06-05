
import './App.css'
import Auth from './Pages/Auth.jsx'
import {Route, Routes} from "react-router-dom";
import Profile from './Pages/Profile.jsx'
import TestUpload from "./Pages/TestUpload.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/home" element={<Profile />} />
                <Route path="/test-upload" element={<TestUpload />} />
            </Routes>
        </>
    );
}

export default App;

