const Router = require('express')
const router = new Router()
const purchasesController = require('../controllers/purchasesController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/get', authMiddleware, purchasesController.getAll )
router.get('/:id', authMiddleware, purchasesController.getId )
router.post('/create', authMiddleware, purchasesController.create)

module.exports = router