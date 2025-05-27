import db from './index.js';

const seedData = async () => {
    const instruments = [
        {
            name: 'Government Bond',
            current_price: 1000,
            estimated_return: 5,
            maturity_time: 365,
            available_units: 50
        },
        {
            name: 'Gold Commodity',
            current_price: 1800,
            estimated_return: 10,
            maturity_time: 0,
            available_units: 100
        },
        {
            name: 'Equity Fund',
            current_price: 150,
            estimated_return: 8,
            maturity_time: 0,
            available_units: 200
        },
        {
            name: 'Real Estate Investment Trust',
            current_price: 120,
            estimated_return: 6,
            maturity_time: 0,
            available_units: 75
        }
    ];

    const users = [
        {
            username: 'user1',
            password: 'password1',
            role: 'user'
        },
        {
            username: 'admin1',
            password: 'password2',
            role: 'admin'
        }
    ];

    await db('instruments').insert(instruments);
    await db('users').insert(users);
};

seedData()
    .then(() => {
        console.log('Database seeded successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    });