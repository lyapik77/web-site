const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users, Basket, Bonus } = require('../models/models');

// Общая функция выпуска токена — используется в registration, login и check
function generateJwt(id, email, role) {
  return jwt.sign(
    { id, email, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
}

class UserController {
  async registration(req, res) {
    try {
      const { name_user, email, password, role } = req.body;

      if (!name_user || !email || !password) {
        return res.status(400).json({ message: 'Все поля должны быть заполнены' });
      }

      const candidate = await Users.findOne({ where: { email } });
      if (candidate) {
        return res.status(400).json({ message: 'Такой пользователь уже существует' });
      }

      const hashPassword = await bcrypt.hash(password, 8);
      const username = name_user.charAt(0).toUpperCase() + name_user.slice(1);

      const new_user = await Users.create({
        name_user: username,
        email,
        password: hashPassword,
        role,
      });

      // Корзина + бонусный счёт
      await Basket.create({ userId: new_user.id });
      await Bonus.create({ userId: new_user.id, quantily: 0 });

      const token = generateJwt(new_user.id, new_user.email, new_user.role);

      return res.status(200).json({
        message: 'Пользователь успешно создан',
        token,
      });
    } catch (error) {
      console.error('registration:', error);
      return res.status(500).json({ message: 'Ошибка создания пользователя' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const candidate = await Users.findOne({ where: { email } });
      if (!candidate) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const match = await bcrypt.compare(password, candidate.password);
      if (!match) {
        return res.status(400).json({ message: 'Пароль неверный' });
      }

      const token = generateJwt(candidate.id, candidate.email, candidate.role);

      return res.status(200).json({
        message: 'Пользователь успешно авторизировался',
        token,
      });
    } catch (error) {
      console.error('login:', error);
      return res.status(500).json({ message: 'Ошибка в авторизации' });
    }
  }

  async check(req, res) {
    try {
      const token = generateJwt(req.user.id, req.user.email, req.user.role);
      return res.json({ token });
    } catch (error) {
      console.error('check:', error);
      return res.status(500).json({ message: 'Ошибка проверки токена' });
    }
  }

  async getProfile(req, res, next) {
    try {
      console.log('req.user:', req.user);

      const user = await Users.findByPk(req.user.id, {
        attributes: ['id', 'name_user', 'email', 'role'],
        include: [{ model: Bonus, attributes: ['quantily'] }],
      });

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      return res.json({
        name_user: user.name_user,
        email: user.email,
        points: user.Bonus?.quantily ?? 0,
      });
    } catch (e) {
      console.error('ОШИБКА /user/me:', e);
      next(ApiError.internal(e.message));
    }
  }

  async findAll(req, res) {
    try {
      const user = await Users.findAll();
      return res.send(user);
    } catch (error) {
      console.error('findAll:', error);
      return res.status(500).json({ message: 'Ресурс не найден' });
    }
  }

  async findEmail(req, res) {
    try {
      const { email } = req.body;
      const candidate = await Users.findOne({ where: { email } });
      if (!candidate) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(candidate);
    } catch (error) {
      console.error('findEmail:', error);
      return res.status(500).json({ message: 'Ресурс не найден' });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const candidate = await Users.findByPk(id);
      if (!candidate) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      await candidate.destroy();
      return res.status(200).json({ message: 'Пользователь успешно удален' });
    } catch (error) {
      console.error('deleteUser:', error);
      return res.status(500).json({ message: 'Ошибка в удалении пользователя' });
    }
  }
}

module.exports = new UserController();