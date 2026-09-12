const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const basketRouter = require('./basketRouter')
const basket_productRouter = require('./basket_productRouter')
const bonusRouter = require('./bonusRouter')
const productRouter = require('./productRouter')
const purchasesRouter = require('./purchasesRouter')

router.use('/user', userRouter)
router.use('/bonus', bonusRouter)
router.use('/basket', basketRouter)
router.use('/basket2', basket_productRouter)
router.use('/purchases', purchasesRouter)
router.use('/product', productRouter)

module.exports = router