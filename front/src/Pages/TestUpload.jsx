import React, { useEffect, useState } from 'react';
import api from '../shared/api.jsx';

function TestUpload() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/categories/')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    try {
      // Собираем данные, приводим типы
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: parseInt(form.category),
      };

      // Создаём товар
      const productRes = await api.post('/api/products/create/', productData);
      const productId = productRes.data.id;

      // Загружаем изображение
      const formData = new FormData();
      formData.append('image', image);
      formData.append('product_id', productId);

      await api.client.post('/api/productimages/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('✅ Товар успешно создан и изображение загружено!');
      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
      });
      setImage(null);
    } catch (err) {
      console.error(err);
      setError('❌ Ошибка при создании товара или загрузке изображения');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Создание товара</h2>

      <input name="name" placeholder="Название" value={form.name} onChange={handleChange} />
      <br />
      <input name="description" placeholder="Описание" value={form.description} onChange={handleChange} />
      <br />
      <input name="price" type="number" placeholder="Цена" value={form.price} onChange={handleChange} />
      <br />
      <input name="stock" type="number" placeholder="Количество" value={form.stock} onChange={handleChange} />
      <br />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Выберите категорию</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <br />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br />
      <button onClick={handleSubmit}>Создать товар</button>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default TestUpload;
