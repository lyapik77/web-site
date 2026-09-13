const Router = require('express')
const router = new Router()
const productControllers = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/get', productControllers.getAll )
router.get('/:id', productControllers.getId )
router.post('/create', checkRole('ADMIN') ,productControllers.create)
router.put('/update', checkRole('ADMIN') ,productControllers.update )
router.delete('/:id', checkRole('ADMIN') ,productControllers.delete )

module.exports = router