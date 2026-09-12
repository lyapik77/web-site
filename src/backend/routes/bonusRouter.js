const Router = require('express')
const router = new Router()
const bonusController = require('../controllers/bonusController')

router.get('/', bonusController.getAll)
router.put('/', bonusController.update)

module.exports = router