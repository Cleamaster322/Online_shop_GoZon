import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import api from '../shared/api.jsx';

function ProductPage() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Загружаем товар
        api.get(`/api/products/${id}/`)
            .then(res => setProduct(res.data))
            .catch(() => setError('Ошибка загрузки товара'));

        // Загружаем изображения
        api.get(`/api/productimages/?product=${id}`)
            .then(res => setImages(res.data))
            .catch(() => {
            });
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!product) return <div>Загрузка...</div>;

    return (
        <div style={{display: 'flex', padding: '20px', gap: '20px'}}>
            {/* Левая часть — галерея */}
            <div>
                {/* Маленькие превью (если есть дополнительные) */}
                {images.length > 1 && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        {images.slice(1).map(img => (
                            <img
                                key={img.id}
                                src={`http://127.0.0.1:8000${img.image_url}`}
                                alt="preview"
                                style={{width: '60px', height: '60px', objectFit: 'cover'}}
                            />
                        ))}
                    </div>
                )}

                {/* Большая картинка */}
                <div style={{marginTop: '20px'}}>
                    {images[0] ? (
                        <img
                            src={`http://127.0.0.1:8000${images[0].image_url}`}
                            alt={product.name}
                            style={{width: '300px', height: '300px', objectFit: 'cover'}}
                        />
                    ) : (
                        <div style={{width: '300px', height: '300px', background: '#eee'}}>Нет изображения</div>
                    )}
                </div>
            </div>

            {/* Правая часть — инфа */}
            <div style={{flex: 1}}>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p><strong>{parseFloat(product.price).toFixed(2)} ₽</strong></p>
                <button>В корзину</button>
                <button style={{marginLeft: '10px'}}>Купить сейчас</button>
            </div>
            <div style={{padding: '20px'}}>
                <button onClick={() => navigate('/Shop')}>← Назад в каталог</button>
            </div>
        </div>

    );
}

export default ProductPage;
