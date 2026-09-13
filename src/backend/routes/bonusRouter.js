const Router = require('express')
const router = new Router()
const bonusController = require('../controllers/bonusController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/get', authMiddleware, bonusController.getAll)
router.put('/update', checkRole('ADMIN') ,bonusController.update)

module.exports = router