import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../shared/api.jsx';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [images, setImages] = useState({});
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserId(payload.user_id);
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchOrders = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    api.get('/api/deliveries/'),
                    api.get('/api/products/'),
                ]);

                const userOrders = ordersRes.data.filter(o => o.user === userId);
                const prodMap = Object.fromEntries(productsRes.data.map(p => [p.id, p]));

                setOrders(userOrders);
                setProducts(prodMap);

                const pairs = await Promise.all(
                    userOrders.map(async (o) => {
                        try {
                            const {data} = await api.get(`/api/productimages/?product=${o.product}`);
                            return data.length ? [o.product, data[0].image_url] : null;
                        } catch {
                            return null;
                        }
                    })
                );
                setImages(Object.fromEntries(pairs.filter(Boolean)));
            } catch (e) {
                console.error(e);
                setError('Ошибка загрузки заказов');
            }
        };

        fetchOrders();
    }, [userId]);

    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
    return (
        <div className="min-h-screen bg-[#fdefff] text-black">
            <header className="bg-purple-300 flex items-center px-6 py-3 rounded-xl gap-4">
                <div className="flex items-center gap-4">
                    <img src="/logo.jpg" alt="GosZakaz logo" className="w-14 h-14 rounded-full border-2 border-white"/>
                    <span className="text-3xl font-bold text-white cursor-pointer" onClick={() => navigate('/Shop')}>
          GosZakaz
        </span>
                </div>
                <div className="flex-1"/>
                <button
                    onClick={() => navigate('/home')}
                    className="flex flex-col items-center text-white hover:text-purple-900"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M6 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span className="text-xs">{localStorage.getItem('accessToken') ? 'Профиль' : 'Войти'}</span>
                </button>
            </header>

            <main className="max-w-5xl mx-auto py-8">
                <h2 className="text-2xl font-bold text-purple-700 mb-6">Мои заказы</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-500">У вас пока нет заказов.</p>
                ) : (
                    <ul className="space-y-6">
                        {orders.map((order) => {
                            const product = products[order.product];
                            if (!product) return null;

                            return (
                                <li key={order.id}
                                    className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-4">
                                    {/* Фото */}
                                    <img
                                        src={`http://127.0.0.1:8000${images[product.id]}`}
                                        alt={product.name}
                                        className="w-20 h-20 rounded-xl object-cover"
                                    />

                                    {/* Инфо */}
                                    <div className="flex-1">
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.description || 'Без описания'}</p>
                                    </div>

                                    {/* Статус */}
                                    <div className="text-sm font-semibold text-purple-700">
                                        Статус: <span className="capitalize">{order.status}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </main>
        </div>
    );
}