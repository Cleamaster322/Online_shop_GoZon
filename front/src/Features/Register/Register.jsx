import {useState, useEffect} from 'react'

import axios from 'axios'
import api from "../../shared/api.jsx";
import {Box, Button, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";

function Register({ goToLogin }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    async function submiteData() {
    setError(null); // Сброс ошибки

    try {
        const userData = {
            username,
            password,
            email,
        };

        const registerResponse = await api.post('/api/create_user/', userData);

        if (registerResponse.status === 201) {
            const tokenResponse = await api.post('/api/token/', {
                username,
                password
            });

            if (tokenResponse.status === 200) {
                localStorage.setItem('accessToken', tokenResponse.data['access']);
                localStorage.setItem('refreshToken', tokenResponse.data['refresh']);
                navigate('/home');
            }
        }
    } catch (err) {
        if (err.response && err.response.data) {
            // Если есть ответ с деталями ошибки
            const errorDetails = err.response.data;
            const formattedError = Object.entries(errorDetails)
                .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                .join('\n');
            setError(formattedError);
        } else {
            setError('Произошла ошибка при регистрации.');
        }
    }
}



    // if (loading) return <div>Loading...</div>
    // if (error) return <div>Error ^_^</div>

    return (
        <>
            <Box
                component='form'
                sx={{'& > :not(style)': {m: 1, width: '25ch'}}}
                noValidate
                autoComplete='off'
            >
                <TextField
                    id='outlined-basic'
                    label='username'
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
                            <TextField
                id='outlined-basic'
                label='mail'
                variant='outlined'
                onChange={e => {
                    setEmail(e.target.value)
                }}
            />
                <Button onClick={submiteData} variant='contained'>
                    Отправить
                </Button>
                <Button onClick={goToLogin} variant='contained'>
                    Логин
                </Button>
            </Box>
        </>
    )
}

export default Register