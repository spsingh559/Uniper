var router = require('express').Router();

router.use('/newUsers', require('./user.router'));

exports=module.exports=router;
