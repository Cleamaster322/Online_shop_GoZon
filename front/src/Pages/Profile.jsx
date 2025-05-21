import { useState, useEffect } from "react";
import api from "../shared/api.jsx"; // тут должен быть axios с токеном

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  async function fetchUser() {
    try {
      setLoading(true);
      const response = await api.get(`product/user/me`); // токен берётся из api
      setUser(response.data);
    } catch (error) {
      console.error("Ошибка при получении пользователя:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  fetchUser();
}, []);


  if (loading) return <p>Загрузка...</p>;
  if (!user) return <p>Пользователь не найден</p>;

  return (
    <div>
      <h2>Профиль пользователя</h2>
      <p><strong>Имя пользователя:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Город:</strong> {user.city}</p>
    </div>
  );
}

export default UserProfile;
