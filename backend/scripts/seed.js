const { seedDatabase, clearDatabase } = require('../seeders/databaseSeeder');

const args = process.argv.slice(2);

const runScript = async () => {
    if (args.includes('--seed')) {
        await seedDatabase();
    } else if (args.includes('--clear')) {
        await clearDatabase();
    } else {
        console.log('Please specify an action: --seed or --clear');
    }
    process.exit(0);
};

runScript();