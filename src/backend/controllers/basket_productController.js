const { Basket_Product } = require('../models/models')

class Basket2Controller {
    async getAll(req,res) {
    try {
        const basket = await Basket_Product.findAll()
        return res.send(basket)
    } catch (error) {
        res.status(404).json({
            message: 'Ресурс не найден'
        })
    }
    }

    async create(req,res) {
        try {
        const { } = req.body
        await Basket_Product.create({ })
        return res.status(201).json({ message: 'Товар успешно добавлен в корзину' })
    } catch (error) {
        return res.status(404).json({ message: 'Ошибка добавления товара в корзину' })
    }
    }

    async delete(req,res) {
        try {
        const { id } = req.params
        const candidate = await Basket_Product.findByPk(id)
        await candidate.destroy()
        return res.status(200).json({
            message: 'Пользователь успешно удален'
        })
    } catch (error) {
        return res.status(200).json({
            message: 'Ошибка в удалении пользователя'
        })
    }
    }
}

module.exports = new Basket2Controller()