let express = require('express');
let router = express.Router();
let validateSession = require('../middleware/validate-session');

router.get('/', validateSession, function (req, res){
    res.send ("Log endpoint Test")
})

module.exports = router