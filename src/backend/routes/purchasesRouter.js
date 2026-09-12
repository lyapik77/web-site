const Router = require('express')
const router = new Router()
const purchasesController = require('../controllers/purchasesController')

router.get('/', purchasesController.getAll )
router.get('/:id', purchasesController.getId )
router.post('/', purchasesController.create)

module.exports = router