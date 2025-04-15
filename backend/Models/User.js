const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'eleve', 'enseignant'], // specify allowed roles
        default: 'eleve' // default role if none is specified
    }
});

// Middleware pour hasher le mot de passe avant de sauvegarder
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        console.log('Mot de passe non modifié, middleware ignoré');
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(`Mot de passe haché avant sauvegarde pour ${this.email} : ${this.password}`);
        next();
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        next(error);
    }
});

// Méthode pour vérifier le mot de passe
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log(`Comparaison du mot de passe pour ${this.email} : ${isMatch}`);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
