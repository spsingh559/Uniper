const router = require('express').Router();

console.log('connect to user router');
const UserController = require('./User.Controller.js');

router.post('/',UserController.userFunction);

exports = module.exports = router;
