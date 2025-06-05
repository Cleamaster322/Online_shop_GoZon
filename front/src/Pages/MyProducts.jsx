import React, {useEffect, useState} from 'react';
import api from '../shared/api.jsx';
import {useNavigate} from "react-router-dom";

function MyProducts() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Загружаем пользователя
        api.get('/api/user/me/')
            .then(res => {
                setUser(res.data);
            })
            .catch(() => setError('Ошибка получения пользователя'));
    }, []);

    useEffect(() => {
        if (user) {
            // Загружаем все товары, фильтруем по seller
            api.get('/api/products/')
                .then(res => {
                    const myProducts = res.data.filter(p => p.seller === user.id);
                    setProducts(myProducts);
                })
                .catch(() => setError('Ошибка загрузки товаров'));
        }
    }, [user]);

    if (error) return <div>{error}</div>;
    if (!user) return <div>Загрузка...</div>;

    return (
        <div style={{padding: '20px'}}>
            <h2>Мои товары</h2>

            {products.length === 0 ? (
                <p>У вас пока нет товаров</p>
            ) : (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
                    {products.map(product => (
                        <div key={product.id} style={{border: '1px solid #ccc', padding: '10px', width: '200px'}}>
                            <h4>{product.name}</h4>
                            <p>{product.description}</p>
                            <p><strong>{parseFloat(product.price).toFixed(2)} ₽</strong></p>
                            <button onClick={() => navigate(`/edit-product/${product.id}`)}>
                                Редактировать
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyProducts;
