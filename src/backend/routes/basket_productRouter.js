const Router = require('express')
const router = new Router()
const basket2Controller = require('../controllers/basket_productController')

router.get('/', basket2Controller.getAll)
router.post('/', basket2Controller.create )
router.delete('/:id', basket2Controller.delete )

module.exports = router