const express = require('express');
const router = express.Router();
const mcqController = require('../controllers/mcqController');
const authMiddleware = require('../middlewares/authMiddleware');

// User routes
router.get('/', mcqController.getQuestions);
router.post('/add', authMiddleware(), mcqController.addQuestion);

// Admin routes
// router.get('/admin/requests', authMiddleware.ensureAdmin, mcqController.getPendingQuestions);

router.get('/admin/requests', mcqController.getPendingQuestions);

router.post('/admin/approve/:id', mcqController.approveQuestion);
router.post('/admin/delete/:id', mcqController.deleteQuestion);

module.exports = router;
