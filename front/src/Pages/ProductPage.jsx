import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import api from '../shared/api.jsx';
import Auth from '../Features/Auth.jsx';

function ProductPage() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showAuth, setShowAuth] = useState(false);
    const [selectedImgIdx, setSelectedImgIdx] = useState(0);

    const handleProfileClick = () => {
        if (localStorage.getItem('accessToken')) {
            navigate('/home');
        } else {
            setShowAuth(true);
        }
    };

    const handleCartAdd = (e, productId) => {
      e.stopPropagation();
      if (localStorage.getItem('accessToken')) {
        addToCart(productId);
      } else {
        setShowAuth(true);
      }
    };

    const handleCartClick = () => {
        if (localStorage.getItem('accessToken')) {
            navigate('/CartPage');
        } else {
            setShowAuth(true);
        }
    };

    const handleAddAndGo = async (e, productId) => {
      e.stopPropagation();

      if (!localStorage.getItem('accessToken')) {
          setShowAuth(true);
          return;
      }
      try {
          await addToCart(productId);
          navigate('/CartPage');
      } catch (err) {
          console.error(err);
          alert('❌ Не удалось добавить товар в корзину');
      }
    };

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

    useEffect(() => {
        // Загружаем товар
        api.get(`/api/products/${id}/`)
            .then(res => setProduct(res.data))
            .catch(() => setError('Ошибка загрузки товара'));

        // Загружаем изображения
        api.get(`/api/productimages/?product=${id}`)
            .then(res => setImages(res.data))
            .catch(() => {
            });
    }, [id]);

    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (!product) return(
        <div className="flex justify-center items-center h-screen">
            <span className="animate-pulse text-gray-500">Загрузка...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col">
            {/* Header */}
            <header className="bg-purple-300 flex items-center px-6 py-3 rounded-xl gap-4 mt-2 mx-2">
                <div className="flex items-center gap-4">
                    <img src="/logo.jpg" alt="GosZakaz logo" className="w-14 h-14 rounded-full border-2 border-white" />
                    <span className="text-3xl font-bold text-white cursor-pointer" onClick={() => navigate('/Shop')}>GosZakaz</span>
                </div>
                <input
                    type="text"
                    placeholder="Найти на GosZakaz"
                    className="flex-1 min-w-0 px-2 py-2 rounded bg-white text-gray-700 focus:outline-none mx-4"
                />
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

            {/* Main Product Section */}
            <main className="w-full  flex-1 flex flex-col">
                {/* Desktop layout */}
                <div className="hidden md:flex flex-row gap-8 px-8 py-8 w-full h-full">
                    {/* Left: Thumbnails + Main Image */}
                    <div className="flex flex-row items-start">
                        {/* Thumbnails */}
                        <div className="flex flex-col gap-3">
                            {images.map((img, idx) => (
                                <img
                                    key={img.id}
                                    src={`http://127.0.0.1:8000${img.image_url}`}
                                    alt="preview"
                                    className={`w-24 h-24 object-cover rounded-lg border-2 cursor-pointer ${selectedImgIdx === idx ? 'border-purple-500' : 'border-transparent'}`}
                                    onClick={() => setSelectedImgIdx(idx)}
                                />
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="ml-4">
                            {images[selectedImgIdx] ? (
                                <img
                                    src={`http://127.0.0.1:8000${images[selectedImgIdx].image_url}`}
                                    alt={product.name}
                                    className="w-[440px] h-[560px] object-cover rounded-xl shadow-lg"
                                />
                            ) : (
                                <div className="w-[440px] h-[560px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                                    Нет изображения
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right: Info Section */}
                    <div className="flex flex-row flex-1 items-start justify-between h-[480px]">
                        {/* Attributes */}
                        <div className="bg-purple-200/70 rounded-2xl p-8 shadow min-w-[600px] max-w-[600px]">
                            <h2 className="text-xl text-black font-bold mb-4">{product.name}</h2>
                            <div className="text-sm text-black/80 space-y-1">
                                <div>Артикул <span className="float-right">{product.id}</span></div>
                                <div>Материал изделия <span className="float-right">ткань</span></div>
                                <div>Вид застежки <span className="float-right">без застежки</span></div>
                                <div>Подкладка <span className="float-right">нет</span></div>
                                <div>Декоративные элементы <span className="float-right">без элементов</span></div>
                                <div>Страна производства <span className="float-right">Россия</span></div>
                                <div>Комплектация <span className="float-right">маска карнавальная - 1 шт.</span></div>
                            </div>
                        </div>
                        {/* Price and Buttons */}
                        <div className="mt-4 mr-34">
                            <div className="bg-white rounded-2xl p-8 shadow-lg w-[270px] flex flex-col items-center">
                                <div className="text-4xl font-bold text-purple-500 mb-4">{parseFloat(product.price).toFixed(0)} ₽</div>
                                <button onClick={e => handleCartAdd(e, product.id)} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded mb-3 transition">В корзину</button>
                                <button onClick={e => handleAddAndGo(e, product.id)} className="w-full bg-purple-300 hover:bg-purple-400 text-purple-600 font-semibold py-2 rounded transition">Купить сейчас</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Description below all product info (desktop only) */}
                <section className="hidden md:block px-16 pb-16">
                    <h3 className="text-xl text-black font-bold mb-2">Описание</h3>
                    <div className="text-base text-black/90">{product.description}</div>
                </section>
                {/* Mobile layout */}
                <div className="flex flex-col md:hidden px-2 pt-4 pb-24 w-full">
                    {/* Image carousel */}
                    <div className="w-full flex overflow-x-auto gap-2">
                        {images.map((img, idx) => (
                            <img
                                key={img.id}
                                src={`http://127.0.0.1:8000${img.image_url}`}
                                alt="preview"
                                className={`h-64 w-auto rounded-xl shadow-lg flex-shrink-0 border-2 ${selectedImgIdx === idx ? 'border-purple-500' : 'border-transparent'}`}
                                onClick={() => setSelectedImgIdx(idx)}
                            />
                        ))}
                    </div>
                    <div className="ml-8">
                        <div className="text-4xl font-bold text-purple-500 mb-4">{parseFloat(product.price).toFixed(0)} ₽</div>
                    </div>
                    {/* Attributes */}
                    <div className="bg-purple-200/70 rounded-2xl p-4 shadow mt-4">
                        <h2 className="text-lg  text-black font-bold mb-2">{product.name}</h2>
                        <div className="text-xs text-black/80 space-y-1">
                            <div>Артикул <span className="float-right">{product.id}</span></div>
                            <div>Материал изделия <span className="float-right">ткань</span></div>
                            <div>Вид застежки <span className="float-right">без застежки</span></div>
                            <div>Подкладка <span className="float-right">нет</span></div>
                            <div>Декоративные элементы <span className="float-right">без элементов</span></div>
                            <div>Страна производства <span className="float-right">Россия</span></div>
                            <div>Комплектация <span className="float-right">маска карнавальная - 1 шт.</span></div>
                        </div>
                    </div>
                    {/* Description */}
                    <div className="mt-4">
                        <h3 className="text-lg text-black font-bold mb-2">Описание</h3>
                        <div className="text-sm text-black/90">
                            {product.description}
                        </div>
                    </div>
                </div>
            </main>
            {/* Fixed Add to Cart button for mobile */}
            <div className="md:hidden fixed bottom-16 left-0 w-full px-4 z-50">
                <button onClick={e => {e.stopPropagation(); addToCart(product.id);}} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg text-lg">
                    В корзину
                </button>
            </div>
            {/* Footer */}
            <footer className="fixed bottom-0 left-0 w-full bg-purple-300 flex md:hidden justify-around items-center py-2 z-50">
                <button className="p-2 rounded bg-purple-200 hover:bg-purple-400">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
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

export default ProductPage;
