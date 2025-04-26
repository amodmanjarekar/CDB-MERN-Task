const express = require('express');
const { getProfiles, addProfile, editProfile, deleteProfile } = require('../controllers/profileController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProfiles);
router.post('/', addProfile);

// Protected routes
router.put('/:id', verifyToken, editProfile);
router.delete('/:id', verifyToken, deleteProfile);

module.exports = router;
