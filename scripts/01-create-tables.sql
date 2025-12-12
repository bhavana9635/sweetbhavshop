-- Create users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

-- Create sweets collection indexes
db.sweets.createIndex({ name: 1 });
db.sweets.createIndex({ category: 1 });
db.sweets.createIndex({ price: 1 });
db.sweets.createIndex({ createdAt: -1 });

-- Create purchases collection indexes
db.purchases.createIndex({ userId: 1 });
db.purchases.createIndex({ sweetId: 1 });
db.purchases.createIndex({ purchaseDate: -1 });
