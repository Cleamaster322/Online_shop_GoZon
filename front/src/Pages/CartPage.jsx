import React, { useEffect, useState } from 'react';
import api from '../shared/api.jsx';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Получаем user_id из accessToken
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.user_id);
      }
    } catch (e) {
      console.error('Ошибка разбора accessToken', e);
      setError('Ошибка авторизации');
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    // Загружаем все продукты
    api.get('/api/products/')
      .then(res => {
        const map = {};
        for (let p of res.data) {
          map[p.id] = p;
        }
        setProducts(map);
      })
      .catch(() => setError('Ошибка загрузки товаров'));

    // Загружаем корзину
    api.get('/api/cartitems/')
      .then(res => {
        const myItems = res.data.filter(item => item.user === userId);
        setCartItems(myItems);
      })
      .catch(() => setError('Ошибка загрузки корзины'));
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/cartitems/${id}/delete/`);
      setCartItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const total = cartItems.reduce((acc, item) => {
    const product = products[item.product];
    return product ? acc + product.price * item.quantity : acc;
  }, 0);

  if (error) return <div>{error}</div>;
  if (cartItems.length === 0) return <div>Корзина пуста</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Корзина</h2>

      <ul>
        {cartItems.map(item => {
          const product = products[item.product];
          if (!product) return null;

          return (
            <li key={item.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
              <p><strong>{product.name}</strong></p>
              <p>Количество: {item.quantity}</p>
              <p>Цена за шт: {product.price} ₽</p>
              <p>Сумма: {product.price * item.quantity} ₽</p>
              <button onClick={() => handleDelete(item.id)}>Удалить</button>
            </li>
          );
        })}
      </ul>

      <h3>Итого: {total.toFixed(2)} ₽</h3>
    </div>
  );
}

export default CartPage;
