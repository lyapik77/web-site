const Router = require('express')
const router = new Router()
const productControllers = require('../controllers/productController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/', productControllers.getAll )
router.get('/:id', productControllers.getId )
router.post('/', productControllers.create)
router.put('/', productControllers.update )
router.delete('/:id', productControllers.delete )

module.exports = router