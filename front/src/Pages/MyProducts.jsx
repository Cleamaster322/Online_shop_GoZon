import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../shared/api.jsx";
import Auth from "../Features/Auth.jsx";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState({});
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () =>
    localStorage.getItem("accessToken") ? navigate("/home") : setShowAuth(true);

  useEffect(() => {
    api
      .get("/api/user/me/")
      .then((res) => setUser(res.data))
      .catch(() => setError("Ошибка получения пользователя"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/products/");
        const mine = res.data.filter((p) => p.seller === user.id);
        setProducts(mine);

        const imageMap = {};
        for (let product of mine) {
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
      } catch (err) {
        setError("Ошибка загрузки товаров");
      }
    };

    if (user) fetchData();
  }, [user]);

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-pulse text-gray-500">Загрузка...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fdefff]">
      {/* Header */}
      <header className="bg-purple-300 flex items-center px-6 py-3 rounded-xl gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="GosZakaz logo"
            className="w-14 h-14 rounded-full border-2 border-white cursor-pointer"
            onClick={() => navigate("/Shop")}
          />
          <span
            className="text-3xl font-bold text-white cursor-pointer"
            onClick={() => navigate("/Shop")}
          >
            GosZakaz
          </span>
        </div>
        <div className="flex-1" />
        <button
          onClick={handleProfileClick}
          className="flex flex-col items-center text-white hover:text-purple-900"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="8" r="4" strokeWidth="2" />
            <path d="M6 20c0-2.21 3.58-4 8-4s8 1.79 8 4" strokeWidth="2" />
          </svg>
          <span className="text-xs">
            {localStorage.getItem("accessToken") ? "Профиль" : "Войти"}
          </span>
        </button>
      </header>

      {/* Product grid */}
      <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 py-6 justify-items-center">
        {products.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            У вас пока нет товаров
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg=white rounded-xl shadow-lg p-4 w-full max-w-xs cursor-pointer hover:shadow-2xl transition-shadow duration-300"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {images[product.id] ? (
                <img
                  src={`http://127.0.0.1:8000${images[product.id]}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400">
                  Нет изображения
                </div>
              )}

              <p className="text-xl font-bold text-purple-700 mb-1">
                {Number.isInteger(+product.price)
                  ? Number(product.price)
                  : (+product.price).toFixed(2)} ₽
              </p>
              <p className="text-xl font-bold text-black mb-1">{product.name}</p>
              <p className="text-gray-600 mb-1">{product.description}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // чтобы не перейти по карточке
                  navigate(`/edit-product/${product.id}`);
                }}
                className="w-full bg-purple-400 hover:bg-purple-600 text-white font-semibold py-1 rounded transition"
              >
                ✏️ Редактировать
              </button>
            </div>
          ))
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Auth onClose={() => setShowAuth(false)} />
        </div>
      )}
    </div>
  );
}
