import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './ResetPassword.css';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            handleError('Token invalide');
            navigate('/login');
        }
    }, [token, navigate]);

    const validatePassword = (pwd) => {
        return pwd.length >= 8; // Exige au moins 8 caractères
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!password || !confirmPassword) {
            setLoading(false);
            return handleError('Tous les champs sont requis');
        }
        if (!validatePassword(password)) {
            setLoading(false);
            return handleError('Le mot de passe doit contenir au moins 8 caractères');
        }
        if (password !== confirmPassword) {
            setLoading(false);
            return handleError('Les mots de passe ne correspondent pas');
        }

        try {
            const url = `http://localhost:5000/api/auth/reset-password`;
            console.log('Envoi de la requête à :', url, 'avec token et mot de passe');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            console.log('Statut de la réponse :', response.status);
            const result = await response.json();
            console.log('Réponse du serveur :', result);

            if (response.ok && result.success) {
                handleSuccess('Mot de passe réinitialisé avec succès');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                handleError(result.message || 'Erreur lors de la réinitialisation');
            }
        } catch (err) {
            console.error('Erreur détaillée :', err);
            handleError('Erreur réseau ou serveur indisponible');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <form onSubmit={handleSubmit} className="reset-password-form">
                <h1 className="reset-password-title">Réinitialiser le mot de passe</h1>
                <div className="input-group">
                    <label htmlFor="password">Nouveau mot de passe</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name="password"
                        placeholder="Entrez votre nouveau mot de passe"
                        value={password}
                        className="input-field"
                        disabled={loading}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmez votre nouveau mot de passe"
                        value={confirmPassword}
                        className="input-field"
                        disabled={loading}
                    />
                </div>
                <button type="submit" className="reset-btn" disabled={loading}>
                    {loading ? 'Réinitialisation...' : 'Réinitialiser'}
                </button>
                <span className="back-to-login">
                    Retour à la <a href="/login">connexion</a>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default ResetPassword;