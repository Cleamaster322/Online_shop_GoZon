import { useEffect, useState } from 'react'
import axios from 'axios'
import api from "../shared/api.jsx";

function Profile() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

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

  if (error) return <div>{error}</div>
  if (!user) return <div>Загрузка...</div>

  return (
    <div>
      <h2>Профиль</h2>
      <p>Имя: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  )
}

export default Profile
