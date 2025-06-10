import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../shared/api.jsx";
import Auth from "../Features/Auth.jsx";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showAuth, setShowAuth] = useState(false);

  const handleProfileClick = () =>
    localStorage.getItem("accessToken") ? navigate("/home") : setShowAuth(true);

  useEffect(() => {
    api.get(`/api/products/${id}/`).then(res => {
      const p = res.data;
      setForm({
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        category: p.category,
      });
    });

    api.get("/api/categories/").then(res => setCategories(res.data));
    api.get(`/api/productimages/?product=${id}`).then(res => setImages(res.data));
  }, [id]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setMessage({ type: "", text: "" });
    try {
      await api.put(`/api/products/${id}/update/`, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: parseInt(form.category),
      });
      setMessage({ type: "success", text: "✅ Товар обновлён" });
      navigate(`/product/${id}`);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Ошибка при обновлении" });
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) return;
    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("product_id", id);

    try {
      await api.client.post("/api/productimages/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const res = await api.get(`/api/productimages/?product=${id}`);
      setImages(res.data);
      setNewImage(null);
      setMessage({ type: "success", text: "✅ Изображение загружено" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Ошибка загрузки изображения" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fdefff] flex flex-col text-black">
      {/* Header */}
      <header className="bg-purple-300 flex items-center px-6 py-3 gap-4 shadow-md rounded-b-xl">
        <img
          src="/logo.jpg"
          alt="GosZakaz logo"
          className="w-12 h-12 rounded-full border-2 border-white cursor-pointer"
          onClick={() => navigate("/Shop")}
        />
        <span
          className="text-2xl md:text-3xl font-bold text-white cursor-pointer select-none"
          onClick={() => navigate("/Shop")}
        >
          GosZakaz
        </span>
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

      {/* Form Card */}
      <main className="flex-1 flex items-start justify-center pt-10 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-700 text-center">Редактирование товара #{id}</h2>

          <input
            name="name"
            placeholder="Название"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <textarea
            name="description"
            placeholder="Описание"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              placeholder="Цена"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              name="stock"
              type="number"
              placeholder="Количество"
              value={form.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Выберите категорию</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Current Images */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Загруженные изображения:</p>
            <div className="flex flex-wrap gap-2">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={`http://127.0.0.1:8000${img.image_url}`}
                  alt="Фото"
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>

          {/* Image uploader */}
          <label className="w-full flex flex-col items-center px-4 py-6 bg-purple-100 text-purple-700 rounded-lg shadow-md tracking-wide uppercase border border-dashed border-purple-300 cursor-pointer hover:bg-purple-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-5 4l-4-4m0 0l4-4m-4 4h12" />
            </svg>
            <span className="mt-2 text-base leading-normal">
              {newImage ? newImage.name : "Загрузить изображение"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewImage(e.target.files[0])} />
          </label>

          <button
            onClick={handleImageUpload}
            className="w-full bg-purple-400 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition"
            disabled={!newImage}
          >
            Добавить изображение
          </button>

          <button
            onClick={handleUpdate}
            className="w-full bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Сохранить изменения
          </button>

          {message.text && (
            <p className={`text-center font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
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
