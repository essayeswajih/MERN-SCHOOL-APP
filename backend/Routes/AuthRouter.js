const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Controllers/AuthController');
const nodemailer = require('nodemailer');
const ResetToken = require('../Models/ResetToken');
const User = require('../Models/User');
const VerificationCode = require('../Models/VerificationCode');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Configurer le transporteur d’email pour le premier compte (codes de vérification)
const transporterVerification = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // yessineben07@gmail.com
        pass: process.env.EMAIL_PASS
    }
});

// Configurer le transporteur d’email pour le second compte (réinitialisation de mot de passe)
const transporterReset = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER_2, // tahayessine07@gmail.com
        pass: process.env.EMAIL_PASS_2
    }
});

// Route pour l’enregistrement
router.post('/register', registerUser);

// Route pour la connexion
router.post('/login', loginUser);

// Route pour envoyer un code de vérification
router.post('/send-verification-code', async (req, res) => {
    console.log('Requête reçue pour /send-verification-code avec :', req.body);
    const { email } = req.body;

    if (!email) {
        console.log('Email manquant dans la requête');
        return res.status(400).json({ success: false, message: 'Email requis' });
    }

    // Vérifier si l’utilisateur existe déjà
    console.log('Vérification si l’utilisateur existe pour email :', email);
    const userExists = await User.findOne({ email });
    if (userExists) {
        console.log('Utilisateur déjà existant pour email :', email);
        return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    // Générer un code de vérification (6 chiffres)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expire dans 10 minutes
    console.log('Code généré :', verificationCode, 'expire à :', expiresAt);

    // Stocker le code dans la base de données
    try {
        console.log('Sauvegarde du code de vérification dans la base de données...');
        await VerificationCode.findOneAndUpdate(
            { email },
            { email, code: verificationCode, expiresAt },
            { upsert: true, new: true }
        );
        console.log('Code de vérification sauvegardé avec succès');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du code de vérification :', error);
        return res.status(500).json({ success: false, message: 'Erreur lors de la génération du code' });
    }

    // Envoyer l’email avec le code (utiliser le premier compte Gmail)
    const mailOptions = {
        from: process.env.EMAIL_USER, // yessineben07@gmail.com
        to: email,
        subject: 'Code de vérification pour votre inscription',
        text: `Votre code de vérification est : ${verificationCode}. Ce code expire dans 10 minutes.`,
    };

    try {
        console.log('Envoi de l’email à :', email, 'via :', process.env.EMAIL_USER);
        const info = await transporterVerification.sendMail(mailOptions);
        console.log('Email envoyé avec succès. Message ID :', info.messageId);
        console.log(`Code de vérification envoyé à : ${email}`);
        res.status(200).json({ success: true, message: 'Code de vérification envoyé à votre email' });
    } catch (error) {
        console.error('Erreur lors de l’envoi de l’email :', error);
        return res.status(500).json({ success: false, message: 'Erreur lors de l’envoi de l’email', error: error.message });
    }
});

// Route pour vérifier le code
router.post('/verify-code', async (req, res) => {
    console.log('Requête reçue pour /verify-code avec :', req.body);
    const { email, code } = req.body;

    if (!email || !code) {
        console.log('Email ou code manquant dans la requête');
        return res.status(400).json({ success: false, message: 'Email et code requis' });
    }

    // Vérifier le code
    console.log('Vérification du code pour email :', email);
    const codeDoc = await VerificationCode.findOne({ email });
    if (!codeDoc || codeDoc.expiresAt < new Date()) {
        console.log('Code invalide ou expiré pour email :', email);
        return res.status(400).json({ success: false, message: 'Code invalide ou expiré' });
    }

    if (codeDoc.code !== code) {
        console.log('Code incorrect pour email :', email, 'Code attendu :', codeDoc.code, 'Code reçu :', code);
        return res.status(400).json({ success: false, message: 'Code incorrect' });
    }

    console.log('Code vérifié avec succès pour email :', email);
    res.status(200).json({ success: true, message: 'Code vérifié avec succès' });
});

// Route pour demander la réinitialisation du mot de passe
router.post('/forgot-password', async (req, res) => {
    console.log('Requête reçue pour /forgot-password avec email :', req.body.email);
    const { email } = req.body;

    if (!email) {
        console.log('Email manquant dans la requête');
        return res.status(400).json({ success: false, message: 'Email requis' });
    }

    // Vérifier si l’utilisateur existe
    console.log('Vérification si l’utilisateur existe pour email :', email);
    const user = await User.findOne({ email });
    if (!user) {
        console.log('Utilisateur non trouvé pour email :', email);
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const resetToken = Math.random().toString(36).slice(2);
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log('Token de réinitialisation généré :', resetToken);

    // Stocker le token dans la base de données
    try {
        console.log('Sauvegarde du token de réinitialisation dans la base de données...');
        const tokenDoc = new ResetToken({
            email,
            token: resetToken,
            expiresAt: new Date(Date.now() + 3600 * 1000) // Expire dans 1 heure
        });
        await tokenDoc.save();
        console.log('Token de réinitialisation sauvegardé avec succès');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du token de réinitialisation :', error);
        return res.status(500).json({ success: false, message: 'Erreur lors de la génération du token' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER_2, // tahayessine07@gmail.com
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
    };

    console.log('EMAIL_USER_2:', process.env.EMAIL_USER_2);
    console.log('EMAIL_PASS_2:', process.env.EMAIL_PASS_2);

    try {
        console.log('Envoi de l’email à :', email, 'via :', process.env.EMAIL_USER_2);
        await transporterReset.sendMail(mailOptions);
        console.log(`Lien envoyé à : ${email}`);
        res.status(200).json({ success: true, message: 'Un lien de réinitialisation a été envoyé à votre email' });
    } catch (error) {
        console.error('Erreur lors de l’envoi de l’email :', error);
        return res.status(500).json({ success: false, message: 'Erreur lors de l’envoi de l’email' });
    }
});

// Route pour réinitialiser le mot de passe
router.post('/reset-password', async (req, res) => {
    console.log('Requête reçue pour /reset-password avec :', req.body);
    const { token, password } = req.body;

    if (!token || !password) {
        console.log('Token ou mot de passe manquant dans la requête');
        return res.status(400).json({ success: false, message: 'Token et mot de passe requis' });
    }

    // Vérifier le token
    console.log('Vérification du token :', token);
    const tokenDoc = await ResetToken.findOne({ token });
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
        console.log('Token invalide ou expiré :', token);
        return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
    }

    // Trouver l’utilisateur
    console.log('Recherche de l’utilisateur pour email :', tokenDoc.email);
    const user = await User.findOne({ email: tokenDoc.email });
    if (!user) {
        console.log('Utilisateur non trouvé pour email :', tokenDoc.email);
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Hacher le nouveau mot de passe
    let hashedPassword;
    try {
        console.log('Hachage du nouveau mot de passe...');
        hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Nouveau mot de passe haché : ${hashedPassword}`);
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        return res.status(500).json({ success: false, message: 'Erreur lors du hachage du mot de passe' });
    }

    // Mettre à jour le mot de passe directement avec findOneAndUpdate
    try {
        console.log('Mise à jour du mot de passe dans la base de données...');
        const updatedUser = await User.findOneAndUpdate(
            { email: tokenDoc.email },
            { $set: { password: hashedPassword } },
            { new: true }
        );
        if (!updatedUser) {
            console.log('Utilisateur non trouvé lors de la mise à jour pour email :', tokenDoc.email);
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
        console.log(`Mot de passe mis à jour dans la base pour : ${updatedUser.email}, nouveau mot de passe (haché) : ${updatedUser.password}`);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe :', error);
        return res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du mot de passe' });
    }

    // Supprimer le token utilisé
    try {
        console.log('Suppression du token utilisé :', token);
        await ResetToken.deleteOne({ token });
        console.log(`Token ${token} supprimé`);
    } catch (error) {
        console.error('Erreur lors de la suppression du token :', error);
    }

    res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
});

// Route pour récupérer le profil de l'utilisateur
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token manquant' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password'); // Ne pas renvoyer le mot de passe
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ success: true, name: user.name, email: user.email });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
});

// Route pour mettre à jour le profil de l'utilisateur
router.put('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token manquant' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const { name, email, password } = req.body;

        // Mettre à jour les champs
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.status(200).json({ success: true, message: 'Profil mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
});

module.exports = router;