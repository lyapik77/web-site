const { Purchases } = require('../models/models')

class PurchasesController {
    async getAll(req,res) {
        try {
        const purchases = await Purchases.findAll()
        return res.send(purchases)
    } catch (error) {
        res.status(404).json({
            message: 'Ресурс не найден'
        })
    }
    }

    async getId(req,res) {
            try {
        const { id } = req.params
        const purchases = await Purchases.findByPk(id)
        return res.send(purchases)
    } catch (error) {
        res.status(404).json({
            message: 'Ресурс не найден'
        })
    }
    }

    async create(req,res) {
            try {
        const { } = req.body
        await Purchases.create({ })
        return res.status(201).json({ message: 'Товар успешно добавлен' })
    } catch (error) {
        return res.status(404).json({ message: 'Ошибка добавления товара' })
    }
    }

}

module.exports = new PurchasesController()