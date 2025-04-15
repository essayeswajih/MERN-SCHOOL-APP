require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Vérifier les variables d’environnement
console.log('Variables d’environnement chargées :');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

// Importer les routes
const authRoutes = require('./Routes/AuthRouter');
app.use('/api/auth', authRoutes);

// Route de test
app.get('/', (req, res) => res.send('Hello World'));

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => res.status(404).json({ success: false, message: 'Route non trouvée' }));

// Middleware pour gérer les erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Erreur serveur interne' });
});

// Démarrer le serveur après connexion MongoDB
const PORT = process.env.PORT || 5000;

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Démarrer le serveur express, en connectant d'abord
 * à la base de données MongoDB.
/*******  5f5298d3-67dd-4af1-a6e6-834a52345ada  *******/
const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI n\'est pas défini dans les variables d\'environnement');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connecté avec succès');
        app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
    } catch (err) {
        console.error('MongoDB Connection Error: ', err);
        process.exit(1);
    }
};

startServer();