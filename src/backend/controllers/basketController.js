const { Basket } = require('../models/models')

class BasketController {
    async getAll(req,res) {
        try {
        const basket = await Basket.findAll()
        return res.send(basket)
    } catch (error) {
        res.status(404).json({
            message: 'Ресурс не найден'
        })
    }
    }

    async getId(req,res) {
        try {
        const { id } = req.params
        const basket = await Basket.findByPk(id)
        return res.send(basket)
    } catch (error) {
        res.status(404).json({
            message: 'Ресурс не найден'
        })
    }
    }

}

module.exports = new BasketController()