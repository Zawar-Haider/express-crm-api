const express  = require('express');
const router   = express.Router();

const UserController = require("../controllers/user");
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserController.user_signup);
 
router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);
//authorized users can delete other users, need to add that feature

module.exports = router;