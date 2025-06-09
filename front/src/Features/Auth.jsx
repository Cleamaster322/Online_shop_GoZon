import {useState, useEffect} from 'react'
import axios from 'axios'
import api from "../shared/api.jsx";


export default function Auth({ onClose }) {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const res = await api.post('/api/token/', { username: login, password });
            localStorage.setItem('accessToken', res.data.access);
            localStorage.setItem('refreshToken', res.data.refresh)
            window.location.reload();
        } catch (err) {
        setError('Ошибка входа. Проверьте логин и пароль.');
        }
    };

    const handleRegister = async () => {
        try {
            const registerResponse = await api.post('/api/users/create/', { username: login, password, email });
            if (registerResponse.status === 201) {
                const tokenResponse = await api.post('/api/token/', {
                    username: login,
                    password
                });
    
                if (tokenResponse.status === 200) {
                    localStorage.setItem('accessToken', tokenResponse.data['access']);
                    localStorage.setItem('refreshToken', tokenResponse.data['refresh']);
                    setMode('login');
                    setError('Аккаунт создан! Теперь войдите.');
                }
            }
        } catch (err) {
            if (err.response && err.response.data) {
                // Если есть ответ с деталями ошибки
                const errorDetails = err.response.data;
                const formattedError = Object.entries(errorDetails)
                    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                    .join('\n');
                setError(formattedError);
            } else {
                setError('Произошла ошибка при регистрации.');
            }
        }
    };

    return (
        <div className="bg-pink-100 rounded-2xl p-8 shadow-lg flex flex-col items-center min-w-[320px] relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl text-black font-bold mb-4">
            {mode === 'login' ? 'Войти в аккаунт' : 'Регистрация'}
          </h2>
          <input
            type="text"
            placeholder="Введите логин"
            className="w-full mb-3 px-4 py-2 rounded text-black bg-white placeholder-gray-400 font-medium"
            value={login}
            onChange={e => setLogin(e.target.value)}
          />
          <input
            type="password"
            placeholder="Введите пароль"
            className="w-full mb-3 px-4 py-2 rounded  text-black bg-white placeholder-gray-400 font-medium"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {mode === 'register' && (
            <input
              type="email"
              placeholder="Введите email"
              className="w-full mb-3 px-4 py-2 rounded text-black bg-white placeholder-gray-400 font-medium"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          )}
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
          {mode === 'login' ? (
            <>
              <button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded mb-3 transition"
                onClick={handleLogin}
              >
                Войти
              </button>
              <button
                className="w-3/4 bg-purple-300 hover:bg-purple-400 text-white font-semibold py-1 rounded transition text-sm"
                onClick={() => setMode('register')}
              >
                Создать аккаунт
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded mb-3 transition"
                onClick={handleRegister}
              >
                Зарегистрироваться
              </button>
              <button
                className="w-3/4 bg-purple-300 hover:bg-purple-400 text-white font-semibold py-1 rounded transition text-sm"
                onClick={() => setMode('login')}
              >
                Уже есть аккаунт? Войти
              </button>
            </>
          )}
        </div>
      );
    }