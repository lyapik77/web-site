const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  console.log('=== authMiddleware ===');
  console.log('URL:', req.method, req.originalUrl);
  console.log('Header:', header ? header.slice(0, 40) + '...' : '(пусто)');
  console.log('Token:', token ? token.slice(0, 20) + '...' : '(нет)');

  if (!token) {
    return res.status(401).json({ message: 'Нет токена авторизации' });
  }

  try {
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Декодировано:', req.user);
    next();
  } catch (e) {
    console.log('jwt.verify упал:', e.message);
    return res.status(401).json({ message: 'Невалидный токен' });
  }
};