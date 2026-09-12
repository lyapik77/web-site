const { Product } = require('../models/models')

class ProductController {
    async getAll(req,res) {
            try {
        const product = await Product.findAll()
        return res.send(product)
    } catch (error) {
        res.status(404).json({
            message: 'Ресурс не найден'
        })
    }
    }

    async getId(req,res) {
            try {
        const { id } = req.params
        const product = await Product.findByPk(id)
        return res.send(product)
    } catch (error) {
        res.status(404).json({
            message: 'Ресурс не найден'
        })
    }
    }

    async create(req,res) {
         try {
        const { name_product, price_product } = req.body
        await Product.create({ name_product, price_product })
        return res.status(201).json({ message: 'Товар успешно создан' })
    } catch (error) {
        return res.status(404).json({ message: 'Ошибка создания товара' })
    }
    }

    async update(req,res) {
        try {
        const { id } = req.params
        const { name_product, price_product } = req.body
        const candidate = await Product.findByPk(id)
        await candidate.update({ name_product, price_product })
        return res.status(200).json({
            message: 'Данные товара успешно обновлены'
        })
    } catch (error) {
        return res.status(404).json({
            message: 'Ошибка в обновлении данных товара'
        })
    }
    }

    async delete(req,res) {
         try {
        const { id } = req.params
        const candidate = await Product.findByPk(id)
        await candidate.destroy()
        return res.status(200).json({
            message: 'Товар успешно удален'
        })
    } catch (error) {
        return res.status(200).json({
            message: 'Ошибка в удалении товара'
        })
    }
    }

}

module.exports = new ProductController()