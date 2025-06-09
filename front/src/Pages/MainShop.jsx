import React, {useEffect, useState} from 'react';
import api from '../shared/api.jsx';
import {useNavigate} from "react-router-dom";
import Auth from '../Features/Auth.jsx';


function MainShop() {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showAuth, setShowAuth] = useState(false);

    const handleProfileClick = () => {
        if (localStorage.getItem('accessToken')) {
            navigate('/home');
        } else {
            setShowAuth(true);
        }
    };

    useEffect(() => {
        // Загружаем все товары
        api.get('/api/products/')
            .then(async res => {
                const productList = res.data;
                setProducts(productList);

                // Для каждого товара загружаем первое изображение
                const imageMap = {};
                for (let product of productList) {
                    try {
                        const res = await api.get(`/api/productimages/?product=${product.id}`);
                        if (res.data.length > 0) {
                            imageMap[product.id] = res.data[0].image_url;
                        }
                    } catch (err) {
                        console.error(`Не удалось загрузить изображение для товара ${product.id}`);
                    }
                }

                setImages(imageMap);
            })
            .catch(err => {
                console.error(err);
                setError('Ошибка загрузки товаров');
            });
    }, []);

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return alert('Авторизуйтесь для добавления в корзину');

            const userId = JSON.parse(atob(token.split('.')[1])).user_id;

            // Получаем текущие элементы корзины
            const res = await api.get('/api/cartitems/');
            const existing = res.data.find(item => item.user === userId && item.product === productId);

            if (existing) {
                // Если уже есть — обновляем количество
                await api.patch(`/api/cartitems/${existing.id}/update/`, {
                    quantity: existing.quantity + 1
                });
            } else {
                // Если нет — создаём новый
                await api.post('/api/cartitems/create/', {
                    user: userId,
                    product: productId,
                    quantity: 1
                });
            }

            alert('✅ Товар добавлен в корзину');
        } catch (err) {
            console.error(err);
            alert('❌ Не удалось добавить в корзину');
        }
    };


    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (products.length === 0) return (
            <div className="flex justify-center items-center h-screen">
                <span className="animate-pulse text-gray-500">Загрузка...</span>
            </div>
        );

    return (
        <div className="min-h-screen bg-purple-50"> 
            {/* Header */}
            <header className="bg-purple-300 flex items-center px-6 py-3 rounded-xl gap-4">
                {/* Left group: logo, brand, burger */}
                <div className="flex items-center gap-4">
                    <img src="./public/logo.jpg" alt="GosZakaz logo" className="w-14 h-14 rounded-full border-2 border-white" />
                    <span className="text-3xl font-bold text-white cursor-pointer" onClick={() => navigate('/Shop')}>GosZakaz</span>
                    <button className="p-2 rounded bg-purple-200 hover:bg-purple-400 hidden md:flex items-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Найти на GosZakaz"
                    className="flex-1 min-w-0 px-2 py-2 rounded bg-white text-gray-700 focus:outline-none mx-4"
                />
                {/* Profile & Cart */}
                <div className="hidden md:flex items-center gap-4">
                    <button onClick={handleProfileClick} className="flex flex-col items-center text-white hover:text-purple-900">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M6 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-xs">{localStorage.getItem('accessToken') ? 'Профиль' : 'Войти'}</span>
                    </button>
                    <button onClick={() => navigate("/CartPage")} className="flex flex-col items-center text-white hover:text-purple-900">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M3 3h18l-1.68 13.39A2 2 0 0117.34 18H6.66a2 2 0 01-1.98-1.61L3 3z" stroke="currentColor" strokeWidth="2" />
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="15" cy="21" r="1" />
                        </svg>
                        <span className="text-xs">Корзина</span>
                    </button>
                </div>
            </header>

        {/* Product grid */}
        <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 py-6 justify-items-center">
            {products.map(product => (
                <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="bg=white rounded-xl shadow-lg p-4 w-full max-w-xs cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                >
                    {images[product.id] ? (
                        <img
                            src={`http://127.0.0.1:8000${images[product.id]}`}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded-lg mb-2"
                        />
                    ) : (
                        <div className="w-full h-40 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400">
                            Нет изображения
                        </div>
                    )}

                    <p className="text-xl font-bold text-purple-700 mb-1">{
                        Number.isInteger(+product.price)
                          ? Number(product.price)
                          : (+product.price).toFixed(2)
                        } ₽
                    </p>
                    <p className="text-xl front-bold text-black mb-1">{product.name}</p>
                    <p className="text-gray-600 mb-1">{product.description}</p>
                
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            addToCart(product.id);
                        }}
                        className="w-full bg-purple-400 hover:bg-purple-600 text-white font-semibold py-1 rounded transition"
                    >
                        <svg className="inline w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M3 3h18l-1.68 13.39A2 2 0 0117.34 18H6.66a2 2 0 01-1.98-1.61L3 3z" stroke="currentColor" strokeWidth="2" />
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="15" cy="21" r="1" />
                        </svg>
                        В корзину
                    </button>
                </div>
            ))}
        </main>
        {/* Mobile Footer */}
        <footer className="fixed bottom-0 left-0 w-full bg-purple-300 flex md:hidden justify-around items-center py-2 z-50">
                {/* Burger */}
                <button className="p-2 rounded bg-purple-200 hover:bg-purple-400">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {/* Profile */}
                <button onClick={handleProfileClick} className="flex flex-col items-center text-white hover:text-purple-900">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                        <path d="M6 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-xs">{localStorage.getItem('accessToken') ? 'Профиль' : 'Войти'}</span>
                </button>
                {/* Cart */}
                <button onClick={() => navigate("/CartPage")} className="flex flex-col items-center text-white hover:text-purple-900">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18l-1.68 13.39A2 2 0 0117.34 18H6.66a2 2 0 01-1.98-1.61L3 3z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="15" cy="21" r="1" />
                    </svg>
                    <span className="text-xs">Корзина</span>
                </button>
            </footer>
            {/* Auth Modal */}
            {showAuth && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <Auth onClose={() => setShowAuth(false)} />
                </div>
            )}
    </div>
    );
}

export default MainShop;
