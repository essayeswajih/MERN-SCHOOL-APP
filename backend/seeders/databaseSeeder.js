const User = require('../Models/User');
const mongoose = require('mongoose');
require('dotenv').config();

const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: "123456",
        role: "admin"
    },
    {
        name: "Test User",
        email: "user@example.com",
        password: "123456",
        role: "user"
    },
    {
        name: "John Teacher",
        email: "teacher@example.com",
        password: "123456",
        role: "enseignant"
    }
];

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Create users
        const createdUsers = await User.create(users);
        
        console.log('✅ Database seeded successfully');
        console.log('Created users:', createdUsers.map(user => ({
            name: user.name,
            email: user.email,
            role: user.role
        })));

        await mongoose.disconnect();
        console.log('✅ MongoDB disconnected');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Function to clear the database
const clearDatabase = async () => {
    try {
        // Connect to MongoDB
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Delete all collections
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            await collections[key].deleteMany();
            console.log(`✅ Collection ${key} cleared`);
        }

        console.log('✅ Database cleared successfully');

        await mongoose.disconnect();
        console.log('✅ MongoDB disconnected');

    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
};

// Export both functions
module.exports = {
    seedDatabase,
    clearDatabase
};