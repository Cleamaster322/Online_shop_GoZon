import React, { useEffect, useState } from 'react';
import { Minus, Plus, Heart, Trash2 } from 'lucide-react';
import {useNavigate} from "react-router-dom";
import api from '../shared/api.jsx';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [images, setImages] = useState({});
  const [liked, setLiked] = useState(() => new Set());  // id товаров, помеченных «сердцем»
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const isEmpty = cartItems.length === 0;

  const handleProfileClick = () => {
    if (localStorage.getItem('accessToken')) {
      navigate('/home');
    }
  };
// ограничение на количество товаров

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

      const fetchData = async () => {
        try {
          const [prodRes, cartRes] = await Promise.all([
            api.get('/api/products/'),
            api.get('/api/cartitems/'),
          ]);

          /** Формируем map продуктов */
          const prodMap = Object.fromEntries(prodRes.data.map(p => [p.id, p]));
          const filtered = cartRes.data.filter(i => i.user === userId);

          setProducts(prodMap);
          setCartItems(filtered);

          /* 3. Загружаем изображения параллельно и одним проходом  */
          const pairs = await Promise.all(
              filtered.map(async (item) => {
                try {
                  const {data} = await api.get(`/api/productimages/?product=${item.product}`);
                  return data.length ? [item.product, data[0].image_url] : null;
                } catch {
                  console.error(`Не удалось загрузить изображение товара ${item.product}`);
                  return null;
                }
              })
          );

          setImages(Object.fromEntries(pairs.filter(Boolean)));   // ключ = id Product
        } catch (e) {
          console.error(e);
          setError('Ошибка загрузки данных');
        }
      };

      fetchData();
    }, [userId]);

    /* ------------------ API helpers ------------------ */
    const patchQuantity = (id, quantity) =>
        api.patch(`api/cartitems/${id}/update/`, {quantity}).catch((err) => {
          console.error(err);
          setError('Не удалось обновить корзину на сервере');
        });

    const deleteItem = (id) =>
        api.delete(`/api/cartitems/${id}/delete/`).catch((err) => {
          console.error(err);
          setError('Не удалось удалить товар на сервере');
        });

    const increment = (item) => {
      setCartItems((prev) =>
          prev.map((i) => (i.id === item.id ? {...i, quantity: i.quantity + 1} : i)),
      );
      patchQuantity(item.id, item.quantity + 1);
    };

    const decrement = (item) => {
      if (item.quantity === 1) return remove(item.id);
      setCartItems((prev) =>
          prev.map((i) => (i.id === item.id ? {...i, quantity: i.quantity - 1} : i)),
      );
      patchQuantity(item.id, item.quantity - 1);
    };

    const remove = (id) => {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      deleteItem(id);
    };

    const toggleLike = (id) => {
      setLiked((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    };

    const total = cartItems.reduce((acc, item) => {
      const product = products[item.product];
      return product ? acc + product.price * item.quantity : acc;
    }, 0);

    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="min-h-screen bg-[#fdefff] text-black">
          {/* Header */}
          <header className="bg-purple-300 flex items-center px-6 py-3 rounded-xl gap-4 ">
            <div className="flex items-center gap-4">
              <img src="/logo.jpg" alt="GosZakaz logo" className="w-14 h-14 rounded-full border-2 border-white"/>
              <span className="text-3xl font-bold text-white cursor-pointer"
                    onClick={() => navigate('/')}>GosZakaz</span>
            </div>
            <input
                type="text"
                placeholder="Найти на GosZakaz"
                className="flex-1 min-w-0 px-2 py-2 rounded bg-white text-gray-700 focus:outline-none mx-4"
            />
            <div className="hidden md:flex items-center gap-4">
              <button onClick={handleProfileClick}
                      className="flex flex-col items-center text-white hover:text-purple-900">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-xs">{localStorage.getItem('accessToken') ? 'Профиль' : 'Войти'}</span>
              </button>
            </div>
          </header>
          <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 py-6 gap-8">
            {/* Левая часть: корзина и блоки оформления */}
            <div className="xl:col-span-2 space-y-10">
              {/* Карточка корзины */}
              <div className="bg-white rounded-3xl shadow-md p-6">
                <h2 className="text-2xl  font-bold mb-2">Корзина</h2>
                <p className="text-xs text-gray-400 mb-6">
                  {isEmpty ? 'Нет товаров' : `${cartItems.length} товара(ов)`}
                </p>

                <ul className="space-y-6">
                  {isEmpty ? (
                      <li className="text-gray-400">Ваша корзина пуста</li>
                  ) : (
                      cartItems.map((item) => {
                        const product = products[item.product];
                        if (!product) return null;
                        const likedNow = liked.has(item.id);
                        return (
                            <li
                                key={item.id}
                                className="flex flex-row items-start sm:flex-row sm:items-center gap-4 pb-4 border-b last:border-none"
                            >
                              {/* Изображение */}
                              <img
                                  src={`http://127.0.0.1:8000${images[product.id]}`}
                                  alt={product.name}
                                  className="w-20 h-20 rounded-xl object-cover"
                              />

                              {/* Инфо */}
                              <div className="flex-1">
                                <p className="font-semibold leading-tight  line-clamp-2">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                  {product.description || 'Описание товара'}
                                </p>
                              </div>

                              {/* Кол-во + цена */}
                              <div className="mt-2 flex items-center gap-6">
                                <div className="flex items-center gap-2 select-none">
                                  <IconButton label="Уменьшить" onClick={() => decrement(item)}>
                                    <Minus size={14}/>
                                  </IconButton>
                                  <span className="px-1 text-black">{item.quantity}</span>
                                  <IconButton label="Увеличить" onClick={() => increment(item)}>
                                    <Plus size={14}/>
                                  </IconButton>
                                </div>
                                <p className="font-bold whitespace-nowrap text-black">
                                  {product.price * item.quantity} ₽
                                </p>
                              </div>

                              {/* Действия (desktop) */}
                              <div className="flex items-center gap-4 ml-4">
                                <IconButton label="В избранное" onClick={() => toggleLike(item.id)}>
                                  <Heart
                                      size={14}
                                      className={likedNow ? 'text-red-500 fill-current' : ''}
                                      fill={likedNow ? 'currentColor' : 'none'}
                                  />
                                </IconButton>
                                <IconButton label="Удалить" onClick={() => remove(item.id)}>
                                  {/* Trash2 заменён SVG, чтобы не тащить ещё одну иконку */}
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                  >
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                    <path d="M10 11v6"/>
                                    <path d="M14 11v6"/>
                                    <path d="M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"/>
                                  </svg>
                                </IconButton>
                              </div>
                            </li>
                        );
                      })
                  )}
                </ul>
              </div>

              {/* Способ доставки */}
              <SectionCard title="Способ доставки">
                <button className="text-purple-600 hover:underline">Выбрать адрес доставки</button>
              </SectionCard>
              <SectionCard title="Способ оплаты">
                <button className="text-purple-600 hover:underline">Выбрать способ оплаты</button>
              </SectionCard>
            </div>

            {/* Правая часть: итог */}
            <aside className="sticky top-28 self-start">
              <div className="bg-white rounded-3xl shadow-md p-6 w-full xl:w-72">
                <button className="text-sm text-purple-600 hover:underline mb-3 text-left w-full">
                  Выбрать адрес доставки
                </button>
                <p className="text-sm text-gray-500">Товаров, {cartItems.length} шт.</p>
                <p className="text-3xl font-extrabold mt-2"> {total.toFixed(2)} ₽</p>
                <button disabled={isEmpty}
                        className={`mt-6 w-full rounded-xl py-2 font-semibold transition ${isEmpty ? 'bg-gray-300 cursor-not-allowed text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}>
                  Заказать
                </button>
              </div>
            </aside>
          </div>
          <footer className="fixed bottom-0 left-0 w-full bg-purple-300 flex md:hidden justify-around items-center  mt-4 z-50">
                <button onClick={handleProfileClick} className="flex flex-col items-center text-white hover:text-purple-900">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                        <path d="M6 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-xs">{localStorage.getItem('accessToken') ? 'Профиль' : 'Войти'}</span>
                </button>
            </footer>
        </div>
    );
  }

// Компоненты-помощники
  const IconButton = ({children, onClick, label}) => (
      <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100 transition text-black"
      >
        {children}
      </button>
  );

  const SectionCard = ({title, children}) => (
      <div className="bg-white rounded-3xl shadow-md p-6 border-l-4 border-purple-400 text-black">
        <h3 className="font-bold mb-3 text-black">{title}</h3>
        {children}
      </div>
  );


export default CartPage;

