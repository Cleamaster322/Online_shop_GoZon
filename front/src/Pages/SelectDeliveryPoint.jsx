import React, { useEffect, useState } from 'react';
import api from '../shared/api.jsx';

export default function SelectDeliveryPoint({ onClose }) {
  const [cities, setCities] = useState([]);
  const [points, setPoints] = useState([]);
  const [cityId, setCityId] = useState('');
  const [pointId, setPointId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/cities/')
      .then(res => setCities(res.data))
      .catch(() => setError('Ошибка загрузки городов'));
  }, []);

  useEffect(() => {
    if (!cityId) return;
    api.get(`/api/deliverypoints/`)
      .then(res => {
        const filtered = res.data.filter(p => p.city === Number(cityId));
        setPoints(filtered);
      })
      .catch(() => setError('Ошибка загрузки пунктов'));
  }, [cityId]);

  const handleSubmit = () => {
    if (!pointId) {
      alert('Выберите пункт доставки');
      return;
    }
    localStorage.setItem('selectedDeliveryPoint', pointId);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-700">Выбор адреса доставки</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Города */}
      <select
        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={cityId}
        onChange={(e) => {
          setCityId(e.target.value);
          setPointId('');
        }}
      >
        <option value="">Выберите город</option>
        {cities.map(city => (
          <option key={city.id} value={city.id}>{city.name}</option>
        ))}
      </select>

      {/* Пункты */}
      <select
        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={pointId}
        onChange={(e) => setPointId(e.target.value)}
        disabled={!cityId}
      >
        <option value="">Выберите пункт доставки</option>
        {points.map(point => (
          <option key={point.id} value={point.id}>{point.name}</option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition"
        disabled={!pointId}
      >
        ОК
      </button>

      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
}
