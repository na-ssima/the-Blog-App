const express = require('express')
const router = express.Router()
const loginController = require('../controllers/authentification')

router.post('/', loginController.login)


module.exports = router;