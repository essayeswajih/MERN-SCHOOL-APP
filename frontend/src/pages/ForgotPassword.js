import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email) {
            setLoading(false);
            return handleError('Veuillez entrer votre email');
        }
        if (!validateEmail(email)) {
            setLoading(false);
            return handleError('Veuillez entrer un email valide');
        }

        try {
            const url = `http://localhost:5000/api/auth/forgot-password`;
            console.log('Envoi de la requête à :', url, 'avec email :', email);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            console.log('Statut de la réponse :', response.status);
            const result = await response.json();
            console.log('Réponse du serveur :', result);

            if (response.ok && result.success) {
                handleSuccess('Un lien de réinitialisation a été envoyé à votre email');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                handleError(result.message || 'Une erreur est survenue');
            }
        } catch (err) {
            console.error('Erreur détaillée :', err);
            handleError('Erreur réseau ou serveur indisponible');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <form onSubmit={handleSubmit} className="forgot-password-form">
                <h1 className="forgot-password-title">Trouver votre compte</h1>
                <p className="forgot-password-description">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation.
                </p>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Entrez votre adresse e-mail"
                        value={email}
                        className="input-field"
                        disabled={loading}
                    />
                </div>
                <button type="submit" className="reset-btn" disabled={loading}>
                    {loading ? 'Envoi en cours...' : 'Envoyer'}
                </button>
                <span className="back-to-login">
                    Retour à la <a href="/login">connexion</a>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default ForgotPassword;