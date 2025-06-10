import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../shared/api.jsx";
import Auth from "../Features/Auth.jsx";

/**
 * Страница товара (desktop + mobile)
 * Стили и структура подогнаны под корзину:
 *  - превью слева, большая картинка рядом
 *  - характеристики + описание центральная колонка
 *  - цена и кнопки — правая колонка (широкая карточка как в CartPage)
 */
function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- helpers ---------------- */
  const isAuth = () => Boolean(localStorage.getItem("accessToken"));
  const handleProfileClick = () => (isAuth() ? navigate("/home") : setShowAuth(true));
  const handleCartPageClick = () => (isAuth() ? navigate("/CartPage") : setShowAuth(true));

  const addToCart = async (productId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const userId = JSON.parse(atob(token.split(".")[1])).user_id;

    const { data } = await api.get("/api/cartitems/");
    const existing = data.find((i) => i.user === userId && i.product === productId);

    if (existing) {
      await api.patch(`/api/cartitems/${existing.id}/update/`, { quantity: existing.quantity + 1 });
    } else {
      await api.post("/api/cartitems/create/", { user: userId, product: productId, quantity: 1 });
    }
  };

  const handleCartAdd = async (e, productId, goToCart = false) => {
    e.stopPropagation();
    if (!isAuth()) return setShowAuth(true);
    await addToCart(productId);
    if (goToCart) navigate("/CartPage");
  };

  /* ---------------- data ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const prodRes = await api.get(`/api/products/${id}/`);
        setProduct(prodRes.data);

        const imgRes = await api.get(`/api/productimages/?product=${id}`);
        setImages(imgRes.data);
      } catch (e) {
        console.error(e);
        setError("Ошибка загрузки товара");
      }
    })();
  }, [id]);

  /* ---------------- render conditions ---------------- */
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!product)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-pulse text-gray-500">Загрузка...</span>
      </div>
    );

  const price = Number.parseFloat(product.price).toFixed(0);

  return (
    <div className="min-h-screen bg-[#fdefff] flex flex-col">
      <Header isAuth={isAuth} onProfile={handleProfileClick} onCart={handleCartPageClick} />

      {/** ---------- DESKTOP ---------- **/}
      <main className="hidden xl:grid grid-cols-12 gap-8 max-w-7xl mx-auto w-full flex-1 py-8 px-8">
        <ImagesBlock
          images={images}
          selected={selectedImgIdx}
          setSelected={setSelectedImgIdx}
          name={product.name}
        />

        <SpecsAndDescription product={product} />

        <PriceCard
          price={price}
          onAdd={(e) => handleCartAdd(e, product.id)}
          onBuy={(e) => handleCartAdd(e, product.id, true)}
        />
      </main>

      {/** ---------- MOBILE ---------- **/}
      <MobileLayout
        images={images}
        selected={selectedImgIdx}
        setSelected={setSelectedImgIdx}
        product={product}
        price={price}
        onAdd={handleCartAdd}
        onProfile={handleProfileClick}
        onCart={handleCartPageClick}
      />

      {showAuth && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Auth onClose={() => setShowAuth(false)} />
        </div>
      )}
    </div>
  );
}

/* ===================================================================== */
/* --------------------------- SUB‑COMPONENTS --------------------------- */
/* ===================================================================== */

const Header = ({ isAuth, onProfile, onCart }) => (
  <header className="bg-purple-300 rounded-xl flex items-center px-6 py-3 gap-4">
    <div className="flex items-center gap-4">
      <img src="/logo.jpg" alt="logo" className="w-14 h-14 rounded-full border-2 border-white" />
      <span className="text-3xl font-bold text-white cursor-pointer" onClick={() => (window.location.href = "/")}>GosZakaz</span>
    </div>

    <input
      type="text"
      placeholder="Найти на GosZakaz"
      className="flex-1 min-w-0 px-2 py-2 rounded bg-white text-gray-700 focus:outline-none mx-4"
    />

    <div className="hidden lg:flex items-center gap-4">
      <IconButton onClick={onProfile} label={isAuth() ? "Профиль" : "Войти"}>
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" strokeWidth="2" />
          <path d="M6 20c0-2.21 3.58-4 8-4s8 1.79 8 4" strokeWidth="2" />
        </svg>
      </IconButton>

      <IconButton onClick={onCart} label="Корзина">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h18l-1.68 13.39A2 2 0 0117.34 18H6.66a2 2 0 01-1.98-1.61L3 3z" strokeWidth="2" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="15" cy="21" r="1" />
        </svg>
      </IconButton>
    </div>
  </header>
);

const IconButton = ({ children, onClick, label }) => (
  <button onClick={onClick} className="flex flex-col items-center text-white hover:text-purple-900" aria-label={label} title={label}>
    {children}
    <span className="text-xs mt-0.5">{label}</span>
  </button>
);

/* ---------- IMAGES BLOCK (desktop) ---------- */
const ImagesBlock = ({ images, selected, setSelected, name }) => (
  <div className="col-span-6 flex gap-6 items-start">
    {/* Thumbnails */}
    <div className="flex flex-col gap-3">
      {images.map((img, idx) => (
        <img
          key={img.id}
          src={`http://127.0.0.1:8000${img.image_url}`}
          alt="thumb"
          onClick={() => setSelected(idx)}
          className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-2 shadow ${
            selected === idx ? "border-purple-500" : "border-transparent"
          }`}
        />
      ))}
    </div>

    {/* Main image */}
    {images[selected] ? (
      <img
        src={`http://127.0.0.1:8000${images[selected].image_url}`}
        alt={name}
        className="w-[440px] h-[560px] object-cover rounded-3xl shadow-lg"
      />
    ) : (
      <div className="w-[440px] h-[560px] bg-gray-200 rounded-3xl flex items-center justify-center text-gray-400">
        Нет изображения
      </div>
    )}
  </div>
);

/* ---------- SPECS & DESCRIPTION ---------- */
const SpecRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span>{label}</span>
    <span className="ml-2 whitespace-nowrap">{value}</span>
  </div>
);

const SpecsAndDescription = ({ product }) => (
  <div className="col-span-4 flex flex-col gap-6">
    <div className="bg-white rounded-3xl shadow-md p-6 border-l-4 border-purple-400 text-black space-y-2">
      <h2 className="text-xl font-bold mb-4">{product.name}</h2>
      <SpecRow label="Артикул" value={product.id} />
      <SpecRow label="Материал изделия" value="ткань" />
      <SpecRow label="Вид застёжки" value="без застёжки" />
      <SpecRow label="Подкладка" value="нет" />
      <SpecRow label="Декоративные элементы" value="без элементов" />
      <SpecRow label="Страна производства" value="Россия" />
      <SpecRow label="Комплектация" value="маска карнавальная - 1 шт." />
    </div>

    <div className="bg-white rounded-3xl shadow-md p-6 border-l-4 border-purple-400 text-black">
    <h3 className="text-lg font-bold mb-3">Описание</h3>
      <p className="leading-relaxed whitespace-pre-line text-black/90">
        {product.description}
      </p>
    </div>
  </div>
);

/* ---------- PRICE CARD ---------- */
const PriceCard = ({ price, onAdd, onBuy }) => (
  <aside className="col-span-2 sticky top-24 self-start">
    <div className="bg-white rounded-3xl shadow-md p-10 xl:w-80 flex flex-col items-center">
      <div className="text-5xl font-extrabold text-purple-600 mb-8">
        {price} ₽
      </div>

      <button
        onClick={onAdd}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition mb-4"
      >
        В корзину
      </button>
      <button
        onClick={onBuy}
        className="w-full bg-purple-300 hover:bg-purple-400 text-purple-700 font-semibold py-3 rounded-xl transition"
      >
        Купить сейчас
      </button>
    </div>
  </aside>
);

/* ---------- MOBILE LAYOUT ---------- */
const MobileLayout = ({
  images,
  selected,
  setSelected,
  product,
  price,
  onAdd,
  onProfile,
  onCart,
}) => {

  return (
    <>
      {/* контент */}
      <div className="xl:hidden flex-1 w-full px-2 pt-4 pb-24 flex flex-col gap-4">
        {/* карусель изображений */}
        <div className="flex overflow-x-auto gap-2">
          {images.map((img, idx) => (
            <img
              key={img.id}
              src={`http://127.0.0.1:8000${img.image_url}`}
              alt="preview"
              onClick={() => setSelected(idx)}
              className={`h-64 flex-shrink-0 rounded-xl shadow-lg border-2 ${
                selected === idx ? 'border-purple-500' : 'border-transparent'
              }`}
            />
          ))}
        </div>

        <div className="text-4xl font-extrabold text-purple-600 ml-4">
          {price} ₽
        </div>

        <SpecsAndDescription product={product} />
      </div>

      {/* фикс-кнопка Add to Cart */}
      <div className="xl:hidden fixed bottom-16 left-0 w-full px-4 z-30">
        <button
          onClick={(e) => onAdd(e, product.id)}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg text-lg"
        >
          В корзину
        </button>
      </div>

      {/* мобильный футер */}
      <footer className="xl:hidden fixed bottom-0 left-0 w-full bg-purple-300 flex justify-around items-center py-2 z-20">
        <button className="p-2 rounded bg-purple-200 hover:bg-purple-400">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <button
          onClick={onProfile}
          className="flex flex-col items-center text-white hover:text-purple-900"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="8" r="4" strokeWidth={2} />
            <path d="M6 20c0-2.21 3.58-4 8-4s8 1.79 8 4" strokeWidth={2} />
          </svg>
          <span className="text-xs">Профиль</span>
        </button>

        <button
          onClick={onCart}
          className="flex flex-col items-center text-white hover:text-purple-900"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 3h18l-1.68 13.39A2 2 0 0117.34 18H6.66a2 2 0 01-1.98-1.61L3 3z"
              strokeWidth={2}
            />
            <circle cx="9" cy="21" r="1" />
            <circle cx="15" cy="21" r="1" />
          </svg>
          <span className="text-xs">Корзина</span>
        </button>
      </footer>
    </>
  );
};

export default ProductPage;

