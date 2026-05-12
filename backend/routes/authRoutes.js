const express = require('express');
const { register, login, checkEmailForReset, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-verify', checkEmailForReset);
router.post('/reset-password', resetPassword);

module.exports = router;
