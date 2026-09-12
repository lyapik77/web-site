const { Bonus } = require('../models/models')

class BonusController {
    async getAll(req,res) {
        try {
        const bonus = await Bonus.findAll()
        return res.send(bonus)
    } catch (error) {
        res.status(404).json({
            message: 'Ресурс не найден'
        })
    }
    }

    async update(req,res) {
        try {
        const { id } = req.params
        const { quantily } = req.body
        const candidate = await Bonus.findByPk(id)
        await candidate.update({ quantily })
        return res.status(200).json({
            message: 'Бонусы успешно обновлены'
        })
    } catch (error) {
        return res.status(404).json({
            message: 'Ошибка в обновлении бонусов'
        })
    }
    }

}

module.exports = new BonusController()