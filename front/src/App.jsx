import {Route, Routes} from "react-router-dom";
import Profile from './Pages/Profile.jsx'
import TestUpload from "./Pages/TestUpload.jsx";
import MainShop from "./Pages/MainShop.jsx";
import ProductPage from "./Pages/ProductPage.jsx";
import MyProducts from "./Pages/MyProducts.jsx";
import EditProduct from "./Pages/EditProduct.jsx";
import CartPage from "./Pages/CartPage.jsx";
import AuthPage from "./Pages/Auth.jsx";
import SelectDeliveryPoint from "./Pages/SelectDeliveryPoint.jsx";
import MyOrders from "./Pages/MyOrders.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/Auth" element={<AuthPage />} />
                <Route path="/" element={<MainShop />} />
                <Route path="/home" element={<Profile />} />
                <Route path="/test-upload" element={<TestUpload />} />
                <Route path="/Shop" element={<MainShop />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/my-products" element={<MyProducts />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
                <Route path="/CartPage" element={<CartPage />} />
                <Route path="/select-delivery" element={<SelectDeliveryPoint />} />
                <Route path="/MyOrders" element={<MyOrders />} />
            </Routes>
        </>
    );
}

export default App;

