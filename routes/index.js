var express = require('express');
var router = express.Router();
const Question = require('../models/Question'); // Use the model you already created

router.get('/', async function(req, res, next) {
    try {
        const tag = req.query.tag ? req.query.tag.trim() : ''; // Trim extra spaces if any
        // Query to fetch only approved questions, filtered by tags if applicable
        const query = tag ? { tags: { $regex: tag, $options: 'i' }, status: 'approved' } : { status: 'approved' };
        
        const mcqs = await Question.find(query); // Fetch only approved questions
        res.render('index', { title: 'MCQ Platform', mcqs, tag });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
//this is comment
