import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Login.css';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaEye, FaEyeSlash } from 'react-icons/fa';

function Login({ setIsAuthenticated, setUser }) { // Add setUser prop
    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;

        if (!email || !password) return handleError('L’email et le mot de passe sont requis.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return handleError('Veuillez entrer un email valide.');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo),
            });
            const result = await response.json();
            const { message, token, user, error } = result;

            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', user.role);
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userEmail', user.email);
                setUser(user); // Set user state
                setIsAuthenticated(true);
                handleSuccess('Connexion réussie !');
                navigate('/home');
            } else {
                handleError(error?.details[0]?.message || message);
            }
        } catch (err) {
            handleError('Une erreur est survenue. Réessayez.');
        }
    };

    return (
        <div className="container">
            <div className="left-section">
                <h2 className="title">Embarquez pour un Voyage d'Apprentissage d'Exception</h2>
                <p className="description">
                    Découvrez une expérience éducative inégalée. Rejoignez notre plateforme d’excellence dès aujourd’hui.
                </p>
                <Link to="/signup" className="signup-btn">✨ S’Inscrire</Link>
                <div className="dynamic-illustration"></div>
            </div>
            <div className="right-section">
                <form onSubmit={handleLogin} className="login-form">
                    <h1 className="login-title">Connexion</h1>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Entrez votre email..."
                            value={loginInfo.email}
                            className="input-field"
                        />
                    </div>
                    <div className="input-group password-group">
                        <label htmlFor="password">Mot de passe</label>
                        <div className="password-wrapper">
                            <input
                                onChange={handleChange}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Entrez votre mot de passe..."
                                value={loginInfo.password}
                                className="input-field"
                            />
                            <span className="password-toggle" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <Link to="/forgot-password" className="forgot-password-link">
                            Mot de passe oublié ?
                        </Link>
                    </div>
                    <button type="submit" className="login-btn">Se Connecter</button>
                    <span className="signup-link">
                        Pas de compte ? <Link to="/signup">S’Inscrire</Link>
                    </span>
                    <div className="social-login">
                        <p className="social-text">Ou connectez-vous avec</p>
                        <div className="social-icons">
                            <FaFacebookF className="social-icon" />
                            <FaTwitter className="social-icon" />
                            <FaGoogle className="social-icon" />
                            <FaInstagram className="social-icon" />
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;