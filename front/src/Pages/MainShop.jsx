import React, {useEffect, useState} from 'react';
import api from '../shared/api.jsx';
import {useNavigate, useSearchParams} from "react-router-dom";
import { useConfetti } from "../hooks/useConfetti";
import Auth from '../Features/Auth.jsx';


function MainShop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [images, setImages] = useState({});
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const navigate = useNavigate();
    const [showAuth, setShowAuth] = useState(false);
    const { shootAt } = useConfetti();

    const handleProfileClick = () => {
        if (localStorage.getItem('accessToken')) {
            navigate('/home');
        } else {
            setShowAuth(true);
        }
    };

    const handleSearch = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery) {
            setSearchParams({ search: searchQuery });
        } else {
            setSearchParams({});
        }
    };

    const handleCategoryClick = (categoryId) => {
        setSearchParams({ category: categoryId });
        setIsBurgerOpen(false);
    };

    useEffect(() => {
        // Load categories
        api.get('/api/categories/')
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => {
                console.error('Error loading categories:', err);
            });

        // Load products
        api.get('/api/products/')
            .then(async res => {
                const productList = res.data;
                setProducts(productList);

                // Load images for each product
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

        // Load cart items if user is authenticated
        if (localStorage.getItem('accessToken')) {
            loadCartItems();
        }
    }, []);

    useEffect(() => {
        const searchQuery = searchParams.get('search')?.toLowerCase() || '';
        const categoryId = searchParams.get('category');
        
        let filtered = products;
        
        // Apply category filter
        if (categoryId) {
            filtered = filtered.filter(product => product.category === parseInt(categoryId));
        }
        
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchQuery) ||
                product.description.toLowerCase().includes(searchQuery)
            );
        }
        
        setFilteredProducts(filtered);
    }, [searchParams, products]);

    const handleCartAdd = async (e, productId) => {
        e.stopPropagation();
        if (!localStorage.getItem('accessToken')) {
            setShowAuth(true);
            return;
        }

        const isInCart = cartItems.some(item => item.product === productId);
        if (isInCart) {
            await removeFromCart(productId);
        } else {
            await addToCart(productId);
            shootAt(e.currentTarget);
        }
    };

    const handleCartClick = () => {
        if (localStorage.getItem('accessToken')) {
            navigate('/CartPage');
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

        // Load cart items if user is authenticated
        if (localStorage.getItem('accessToken')) {
            loadCartItems();
        }
    }, []);

    const loadCartItems = async () => {
        try {
            const res = await api.get('/api/cartitems/');
            setCartItems(res.data);
        } catch (err) {
            console.error('Error loading cart items:', err);
        }
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const userId = JSON.parse(atob(token.split('.')[1])).user_id;

            await api.post('/api/cartitems/create/', {
                user: userId,
                product: productId,
                quantity: 1
            });

            await loadCartItems();
        } catch (err) {
            console.error(err);
            alert('❌ Не удалось добавить в корзину');
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const cartItem = cartItems.find(item => item.product === productId);
            if (cartItem) {
                await api.delete(`/api/cartitems/${cartItem.id}/delete/`);
                await loadCartItems();
            }
        } catch (err) {
            console.error(err);
            alert('❌ Не удалось удалить из корзины');
        }
    };

    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (products.length === 0) return (
            <div className="flex justify-center items-center h-screen">
                <span className="animate-pulse text-gray-500">Загрузка...</span>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#fdefff]">
            {/* Header */}
            <header className="bg-purple-300 flex items-center px-6 py-3 rounded-xl gap-4">
                {/* Left group: logo, brand, burger */}
                <div className="flex items-center gap-4">
                    <img src="./public/logo.jpg" alt="GosZakaz logo" className="w-14 h-14 rounded-full border-2 border-white" />
                    <span className="text-3xl font-bold text-white cursor-pointer" onClick={() => navigate('/Shop')}>GosZakaz</span>
                    <button
                          className="p-2 rounded bg-purple-200 hover:bg-purple-400 md:flex hidden items-center"
                          onClick={() => setIsBurgerOpen(!isBurgerOpen)}
                        >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* BURGER MENU FOR DESKTOP */}
                {isBurgerOpen && (
                  <div className="hidden md:block absolute top-20 left-4 bg-white text-black rounded-xl shadow-lg p-4 z-50 min-w-[200px] animate-fade-in">
                    <h3 className="text-lg font-bold text-purple-700 mb-3">Категории</h3>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSearchParams({});
                          setIsBurgerOpen(false);
                        }}
                        className="text-left px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        Все товары
                      </button>
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.id)}
                          className="text-left px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Найти на GosZakaz"
                    className="flex-1 min-w-0 px-2 py-2 rounded bg-white text-gray-700 focus:outline-none mx-4"
                    value={searchParams.get('search') || ''}
                    onChange={handleSearch}
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
                    <button onClick={handleCartClick} className="flex flex-col items-center text-white hover:text-purple-900">
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
            {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 mt-10 animate-fade-in">
                    {searchParams.get('search') || searchParams.get('category') ? 'Товары не найдены' : 'Загрузка...'}
                </div>
            ) : (
                filteredProducts.map((product, index) => (
                    <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-white rounded-xl shadow-lg p-4 w-full max-w-xs cursor-pointer hover:shadow-2xl transition-all duration-300 flex flex-col animate-fade-in"
                        style={{
                            animationDelay: `${index * 50}ms`,
                            opacity: 0,
                            animation: 'fadeInUp 0.5s ease forwards'
                        }}
                    >
                        {images[product.id] ? (
                            <img
                                src={`http://127.0.0.1:8000${images[product.id]}`}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-lg mb-2 transition-transform duration-300 hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-40 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400">
                                Нет изображения
                            </div>
                        )}

                        <div className="flex-grow">
                            <p className="text-xl font-bold text-purple-700 mb-1 transition-colors duration-300">
                                {Number.isInteger(+product.price)
                                    ? Number(product.price)
                                    : (+product.price).toFixed(2)
                                } ₽
                            </p>
                            <p className="text-xl font-bold text-black mb-1 transition-colors duration-300">{product.name}</p>
                            <p className="text-gray-600 mb-1 transition-colors duration-300">{product.description}</p>
                        </div>
                    
                        <button
                            onClick={e => handleCartAdd(e, product.id)}
                            className={`w-full font-semibold py-1 rounded transition-all duration-300 mt-auto transform hover:scale-105 ${
                                cartItems.some(item => item.product === product.id)
                                    ? 'bg-red-400 hover:bg-red-600'
                                    : 'bg-purple-400 hover:bg-purple-600'
                            } text-white`}
                        >
                            {cartItems.some(item => item.product === product.id) ? (
                                'Удалить из корзины'
                            ) : (
                                <>
                                    <svg className="inline w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 3h18l-1.68 13.39A2 2 0 0117.34 18H6.66a2 2 0 01-1.98-1.61L3 3z" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="15" cy="21" r="1" />
                                    </svg>
                                    В корзину
                                </>
                            )}
                        </button>
                    </div>
                ))
            )}
        </main>
        <style jsx>{`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideIn {
                from {
                    transform: translateX(-100%);
                }
                to {
                    transform: translateX(0);
                }
            }

            .animate-fade-in {
                animation: fadeInUp 0.5s ease forwards;
            }

            .animate-slide-in {
                animation: slideIn 0.3s ease forwards;
            }
        `}</style>
        {/* Mobile Footer */}
        <footer className="fixed bottom-0 left-0 w-full bg-purple-300 flex md:hidden justify-around items-center py-2 z-50">
                {/* Burger */}
                <button 
                    className="p-2 rounded bg-purple-200 hover:bg-purple-400"
                    onClick={() => setIsBurgerOpen(!isBurgerOpen)}
                >
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
                <button onClick={handleCartClick} className="flex flex-col items-center text-white hover:text-purple-900">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18l-1.68 13.39A2 2 0 0117.34 18H6.66a2 2 0 01-1.98-1.61L3 3z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="15" cy="21" r="1" />
                    </svg>
                    <span className="text-xs">Корзина</span>
                </button>
            </footer>
            {/* Mobile Burger Menu */}
            {isBurgerOpen && (
                <div className="fixed inset-0 text-black bg-black/50 z-40 md:hidden">
                    <div className="absolute top-0 left-0 w-64 h-full bg-white p-4 animate-slide-in flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-purple-700">Категории</h3>
                            <button 
                                onClick={() => setIsBurgerOpen(false)}
                                className="p-2 hover:bg-purple-100 rounded-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => {
                                    setSearchParams({});
                                    setIsBurgerOpen(false);
                                }}
                                className="text-left px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                                Все товары
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className="text-left px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
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
