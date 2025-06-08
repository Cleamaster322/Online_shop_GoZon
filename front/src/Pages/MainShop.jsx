import React, {useEffect, useState} from 'react';
import api from '../shared/api.jsx';
import {useNavigate} from "react-router-dom";

function MainShop() {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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


    if (error) return <div>{error}</div>;
    if (products.length === 0) return <div>Загрузка товаров...</div>;

    return (
        <div style={{padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
            {products.map(product => (
                <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        width: '200px',
                        cursor: 'pointer',
                    }}
                >
                    {images[product.id] ? (
                        <img
                            src={`http://127.0.0.1:8000${images[product.id]}`}
                            alt={product.name}
                            style={{width: '100%', height: '200px', objectFit: 'cover'}}
                        />
                    ) : (
                        <div style={{height: '200px', background: '#eee'}}>Нет изображения</div>
                    )}

                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p><strong>{parseFloat(product.price).toFixed(2)} ₽</strong></p>

                    <button
                        onClick={e => {
                            e.stopPropagation();
                            addToCart(product.id);
                            alert(`Товар "${product.name}" добавлен в корзину`);
                        }}
                    >
                        В корзину
                    </button>
                </div>
            ))}
        </div>
    );
}

export default MainShop;
