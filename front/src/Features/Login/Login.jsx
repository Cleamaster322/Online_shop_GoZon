import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import api from "../../shared/api.jsx";
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

function Login() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState('')
  const [error, setError] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()


  // if (loading) return <div>Loading...</div>
  // if (error) return <div>Error ^_^</div>

  async function submiteData() {
    let response = await api.post('/product/token/', {username, password})
    console.log(response,"111111111111111111111111111111")
    if(response.status === 200){
      localStorage.setItem("accessToken",response.data['access'])
      localStorage.setItem("refreshToken",response.data['refresh'])
      navigate('/profile') //
    }
  }

  return (
    <>
      <Box
        component='form'
        sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete='off'
      >
        <TextField
          id='outlined-basic'
          label='login'
          variant='outlined'
          onChange={e => {
            setUsername(e.target.value)
          }}
        />
        <TextField
          id='outlined-basic'
          label='pass'
          variant='outlined'
          onChange={e => {
            setPassword(e.target.value)
          }}
        />
        <Button onClick={submiteData} variant='contained'>
          Отправить
        </Button>
      </Box>
    </>
  )
}
export default Login