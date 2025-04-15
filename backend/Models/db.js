const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI n\'est pas défini dans les variables d\'environnement');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connecté avec succès');
    } catch (error) {
        console.error('❌ Erreur de connexion à MongoDB : ', error.message);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
