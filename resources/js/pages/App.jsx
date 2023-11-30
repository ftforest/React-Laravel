import React, { useState,useContext } from 'react';
import { useNavigate} from "react-router-dom";
import {AuthContext} from "../hooks/auth-hook";

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [errors, setErrors] = useState({});
    const [btnAccess, setBtnAccess] = useState(true);
    const navigate = useNavigate();
    const { setAuthToken } = useContext(AuthContext);

    const validate = (email,password) => {
        const errors = {};
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        return errors;
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        // Implement login functionality here
        console.log('Logging in with email: ' + email + ' and password: ' + password);
        setErrors(validate(email,password))
        if(_.isEmpty(errors)) {
            try {
                setBtnAccess(false)
                const response = await axios.post('http://127.0.0.1:8000/api/login', {
                    email: email,
                    password: password
                });

                setBtnAccess(true)
                // Сохраняем токен в localStorage
                localStorage.setItem('token', response.data.token);

                // Устанавливаем токен в заголовки Axios для всех будущих запросов
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                setAuthToken(response.data.token)
                navigate('/profile');

            } catch (error) {
                // Обработка ошибок
                setBtnAccess(true)
                setErrors({'axios':'password or email incorrect'})
            }
        }
    }

    const handleRegistration = async (event) => {
        event.preventDefault();
        // Implement registration functionality here
        console.log('Registaring in with email: ' + email + ' and password: ' + password);
        setErrors(validate(email,password))
        if(_.isEmpty(errors)) {
            try {
                setBtnAccess(false)
                const response = await axios.post('http://127.0.0.1:8000/api/register', {
                    name: 'user_'+ Math.floor(Math.random() * 1000),
                    email: email,
                    password: password
                });

                // Сохраняем токен в localStorage
                localStorage.setItem('token', response.data.token);

                // Устанавливаем токен в заголовки Axios для всех будущих запросов
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                setAuthToken(response.data.token)
                navigate('/profile');

            } catch (error) {
                setBtnAccess(true)
                setErrors({'axios':'password or email incorrect'})
                // Обработка ошибок
            }
        }
    }

    const handleToggle = () => {
        setIsLogin(!isLogin)
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-4">

                    {isLogin ?
                        <>
                            {/* Login form */}
                            <div className="mb-3">
                                <label htmlFor="FormControlInputEmail" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="FormControlInputEmail"
                                       name="email"
                                       placeholder="name@example.com" value={email}
                                       onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="FormControlInputPassword" className="form-label">Password</label>
                                <input type="password" className="form-control" id="FormControlInputPassword"
                                       name="password"
                                       placeholder="Password" value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <div className="mb-3 text-bg-warning">
                                {errors.email ? 'Email: '+errors.email : ''}
                            </div>
                            <div className="mb-3 text-bg-warning">
                                {errors.password ? 'Password: '+errors.password : ''}
                            </div>
                            <div className="mb-3 text-bg-warning">
                                {errors.axios ? errors.axios : ''}
                            </div>
                            <div className="justify-content-between d-flex">
                                <button onClick={(e) => handleLogin(e)} type="button" disabled={!btnAccess && 'disabled'} className="btn btn-secondary">Login</button>
                                <button onClick={handleToggle} type="button" disabled={!btnAccess && 'disabled'} className="btn btn-secondary">Registration Form</button>
                            </div>
                        </>
                        :
                        <>
                        {/* Registration form */}
                            <div className="mb-3">
                                <label htmlFor="FormControlInputEmail" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="FormControlInputEmail"
                                       name="email"
                                       placeholder="name@example.com" value={email}
                                       onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="FormControlInputPassword" className="form-label">Password</label>
                                <input type="password" className="form-control" id="FormControlInputPassword"
                                       name="password"
                                       placeholder="Password" value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <div className="mb-3 text-bg-warning">
                                {errors.email ? 'Email: '+errors.email : ''}
                            </div>
                            <div className="mb-3 text-bg-warning">
                                {errors.password ? 'Password: '+errors.password : ''}
                            </div>
                            <div className="mb-3 text-bg-warning">
                                {errors.axios ? errors.axios : ''}
                            </div>
                            <div className="justify-content-between d-flex">
                                <button onClick={(e) => handleRegistration(e)} type="button" disabled={!btnAccess && 'disabled'} className="btn btn-secondary">Registration</button>
                                <button onClick={handleToggle} type="button" disabled={!btnAccess && 'disabled'} className="btn btn-secondary">Login Form</button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;

