const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Users, Basket } = require('../models/models')

class UserController {
    async registration(req,res) {
        try {
        const { name_user, email, password, role } = req.body
        if (!name_user || !email || !password) {
            return res.status(400).json({ message: 'Все поля должны быть заполнены' })
        }
        const candidate = await Users.findOne({ where: { email } })
        if (candidate) {
            return res.status(404).json({ message: 'Такой пользователь уже существует' })
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const new_user = await Users.create({
            name_user,
            email,
            password: hashPassword,
            role
        })
        const new_basket = await Basket.create({userId: new_user.id})
        const token = jwt.sign(
            { email: new_user.email, role: new_user.role },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )

        return res.status(200).json({ message: 'Пользователь успешно создан', token: token })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: 'Ошибка создания пользователя' })
    }
    }

    async login(req,res) {
        try {
        const { email, password } = req.body
        const candidate = await Users.findOne({ where: { email } })
        if (!candidate) {
            return res.status(404).json({ message: 'Пользователь не найден' })
        }
        const match = await bcrypt.compareSync(password, candidate.password)
        if (!match) {
            return res.status(404).json({ message: 'Пароль неверный' })
        }
        const token = jwt.sign(
            { email: candidate.email, role: candidate.role },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )

        return res.status(200).json({ message: 'Пользователь успешно авторизировался', token:token })
    } catch (error) {
        return res.status(404).json({ message: 'Ошибка в авторизации' })
    }
    }


    async check(req,res) {
        const token = generateJwt(req.Users.id, req.Users.email, req.Users.role )
        return res.json({token})
    }
}

module.exports = new UserController()