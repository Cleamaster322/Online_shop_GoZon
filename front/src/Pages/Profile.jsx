import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { LogOut, PlusCircle, ShoppingCart, Home, Boxes } from 'lucide-react';
import api from "../shared/api.jsx";

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setError('No access token');
            return;
        }

        api.get('/api/user/me/', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                setUser(response.data);
            })
            .catch(err => {
                setError('Ошибка при получении профиля');
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    if (error)
        return <div className="text-center text-red-500 mt-10">{error}</div>;

    if (!user)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="animate-pulse text-gray-500">Загрузка...</span>
            </div>
        );

 return (
    <div className="min-h-screen bg-[#f4eeff] py-10 px-4">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center gap-4">
        {/* Аватар‑заглушка */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-4xl font-semibold">
          {user.username[0].toUpperCase()}
        </div>

        {/* Имя и email */}
        <h2 className="text-2xl font-bold text-center text-purple-800">
          {user.username}
        </h2>
        <p className="text-gray-500">{user.email}</p>

        {/* Действия */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <ActionButton onClick={() => navigate('/test-upload')} Icon={PlusCircle} text="Создать товар" />
          <ActionButton onClick={() => navigate('/my-products')} Icon={Boxes} text="Мои товары" />
          <ActionButton onClick={() => navigate('/CartPage')} Icon={ShoppingCart} text="Корзина" />
          <ActionButton onClick={() => navigate('/Shop')} Icon={Home} text="Магазин" />
        </div>

        {/* Выход */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition"
        >
          <LogOut size={18} /> Выйти
        </button>
      </div>
    </div>
  );
}

/**
 * Кнопка для решётки действий с единой стилистикой.
 */
function ActionButton({ onClick, Icon, text }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 py-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 transition"
    >
      <Icon />
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
}

export default Profile;
