const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin Requests Route
router.get('/requests', authMiddleware, adminController.getRequests);

// Approve a pending question
router.post('/approve/:id', authMiddleware, adminController.approveQuestion);

// Delete a pending question
router.post('/delete/:id', authMiddleware, adminController.deleteQuestion);

module.exports = router;
