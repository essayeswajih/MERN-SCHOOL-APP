const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 3600 } // Expire après 1 heure
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);