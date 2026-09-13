const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const Users = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name_user: {type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, unique: true, validate:{isEmail: true}, allowNull: false},
    password: {type: DataTypes.STRING, validate:{min:8}, allowNull: false},
    role: {type: DataTypes.ENUM('ADMIN', 'USER'), defaultValue: 'USER', allowNull: false}
}, {
       updatedAt: false
})

const Basket = sequelize.define('Basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {
    createdAt: false
})

const Basket_Product = sequelize.define('Basket_Product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {
    timestamps: false
})

const Product = sequelize.define('Product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name_product: {type: DataTypes.STRING, allowNull: false},
    price_product: {type: DataTypes.DECIMAL}
})

const Purchases = sequelize.define('Purchases', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: { type: DataTypes.STRING },
    itemsCount: { type: DataTypes.INTEGER, defaultValue: 1 },
    total: { type: DataTypes.DECIMAL, defaultValue: 0 },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
}, {
    updatedAt: false  
})

const Bonus = sequelize.define('Bonus', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantily: {type: DataTypes.INTEGER, allowNull: false}
}, {
    createdAt: false
})

Users.hasOne(Basket)
Basket.belongsTo(Users)

Users.hasOne(Bonus)
Bonus.belongsTo(Users)

Users.hasMany(Purchases)
Purchases.belongsTo(Users)

Basket.hasMany(Basket_Product)
Basket_Product.belongsTo(Basket)

Product.hasOne(Basket_Product)
Basket_Product.belongsTo(Product)

module.exports = { Users, Basket, Basket_Product, Product, Purchases, Bonus }