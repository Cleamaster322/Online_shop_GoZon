import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../shared/api.jsx"

function Profile() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      setError('No access token')
      return
    }

    api.get('/api/user/me/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        setUser(response.data)
      })
      .catch(err => {
        setError('Ошибка при получении профиля')
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem
    ('refreshToken')
    navigate('/')
  }

  if (error) return <div>{error}</div>
  if (!user) return <div>Загрузка...</div>

  return (
    <div>
      <h2>Профиль</h2>
      <p>Имя: {user.username}</p>
      <p>Email: {user.email}</p>

      <button onClick={handleLogout}>Выйти</button>
    </div>
  )
}

export default Profile
