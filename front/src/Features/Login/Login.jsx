import {useState, useEffect} from 'react'

import axios from 'axios'
import api from "../../shared/api.jsx";
import {Box, Button, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";

function Login({ goToRegister }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function submiteData() {
        let response = await api.post('/api/token/', {username, password})
        console.log(response)
        if (response.status === 200) {
            localStorage.setItem('accessToken', response.data['access'])
            localStorage.setItem("refreshToken", response.data['refresh'])
            navigate('/home')
        }
    }


    // if (loading) return <div>Loading...</div>
    // if (error) return <div>Error ^_^</div>

    return (<>
        <Box
            component='form'
            sx={{'& > :not(style)': {m: 1, width: '25ch'}}}
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
            <Button onClick={goToRegister} variant='contained'>
                Регистрация
            </Button>
        </Box>
    </>)
}

export default Login