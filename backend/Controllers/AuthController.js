const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../Middlewares/AuthValidation');
const VerificationCode = require('../Models/VerificationCode');

// Enregistrer un utilisateur
const registerUser = async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, code } = req.body;

    // Vérifier si le code est correct
    const codeDoc = await VerificationCode.findOne({ email });
    if (!codeDoc || codeDoc.expiresAt < new Date()) {
        return res.status(400).json({ success: false, message: 'Code de vérification invalide ou expiré' });
    }
    if (codeDoc.code !== code) {
        return res.status(400).json({ success: false, message: 'Code de vérification incorrect' });
    }

    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) return res.status(400).json({ message: 'Utilisateur déjà existant' });

        const newUser = new User(req.body);
        await newUser.save();

        // Supprimer le code de vérification après l’inscription
        await VerificationCode.deleteOne({ email });

        res.status(201).json({ success: true, message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
};

// Connecter un utilisateur
const loginUser = async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const validPassword = await user.comparePassword(req.body.password);
        if (!validPassword) return res.status(401).json({ message: 'Mot de passe incorrect' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Return more user details
        res.status(200).json({ 
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

module.exports = { registerUser, loginUser };
