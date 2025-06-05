
import './App.css'
import Auth from './Pages/Auth.jsx'
import {Route, Routes} from "react-router-dom";
import Profile from './Pages/Profile.jsx'
import TestUpload from "./Pages/TestUpload.jsx";
import MainShop from "./Pages/MainShop.jsx";
import ProductPage from "./Pages/ProductPage.jsx";
import MyProducts from "./Pages/MyProducts.jsx";
import EditProduct from "./Pages/EditProduct.jsx";


function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/home" element={<Profile />} />
                <Route path="/test-upload" element={<TestUpload />} />
                <Route path="/Shop" element={<MainShop />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/my-products" element={<MyProducts />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
            </Routes>
        </>
    );
}

export default App;

