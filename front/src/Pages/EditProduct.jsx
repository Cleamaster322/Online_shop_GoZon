import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../shared/api.jsx';

function EditProduct() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [success, setSuccess] = useState(null);

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

    api.get('/api/categories/').then(res => setCategories(res.data));

    api.get(`/api/productimages/?product=${id}`).then(res => setImages(res.data));
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setSuccess(null);
    try {
      await api.put(`/api/products/${id}/update/`, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: parseInt(form.category),
      });
      setSuccess('✅ Товар обновлён');
    } catch (err) {
      console.error(err);
      setSuccess('❌ Ошибка при обновлении');
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) return;
    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('product_id', id);

    try {
      await api.client.post('/api/productimages/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Обновить список изображений
      const res = await api.get(`/api/productimages/?product=${id}`);
      setImages(res.data);
      setNewImage(null);
      setSuccess('✅ Изображение загружено');
    } catch (err) {
      console.error(err);
      setSuccess('❌ Ошибка загрузки изображения');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Редактировать товар #{id}</h2>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Название" />
      <br />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Описание" />
      <br />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Цена" />
      <br />
      <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Количество" />
      <br />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Выберите категорию</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <br />
      <button onClick={handleUpdate}>Сохранить изменения</button>

      <h3>Изображения</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        {images.map(img => (
          <img key={img.id} src={`http://127.0.0.1:8000${img.image_url}`} alt="" width="100" height="100" />
        ))}
      </div>

      <input type="file" accept="image/*" onChange={e => setNewImage(e.target.files[0])} />
      <button onClick={handleImageUpload}>Добавить изображение</button>

      {success && <p>{success}</p>}
    </div>
  );
}

export default EditProduct;
