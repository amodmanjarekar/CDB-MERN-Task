const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

// Route to login and get a JWT token
router.post('/', login);

module.exports = router;
