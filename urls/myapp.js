const router = require('express').Router()
const views = require('../views/myapp')
const auth = require('../middlewares/auth')

router.post('/getalldata',auth.verifyAccessToken ,views.getAllData)

module.exports = router