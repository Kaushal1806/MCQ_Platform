const PendingQuestion = require('../models/pendingQuestion');
const Question = require('../models/Question');

// Get all pending questions for admin review
exports.getRequests = async (req, res) => {
  try {
    const pendingQuestions = await PendingQuestion.find({ status: 'pending' }).populate('submittedBy', 'username email');
    res.render('admin-requests', { pendingQuestions });
  } catch (err) {
    console.error('Error fetching pending questions:', err);
    res.status(500).send('Server error');
  }
};

// Approve a pending question and move it to the Question collection
exports.approveQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    // Find the pending question by ID
    const pendingQuestion = await PendingQuestion.findById(questionId);
    if (!pendingQuestion) {
      return res.status(404).send('Pending question not found');
    }

    // Move the pending question to the Question collection
    const newQuestion = new Question({
      question: pendingQuestion.question,
      options: pendingQuestion.options,
      correctAnswer: pendingQuestion.correctAnswer,
      tags: pendingQuestion.tags,
    });

    await newQuestion.save();

    // Delete the pending question after approval
    await PendingQuestion.findByIdAndDelete(questionId);

    res.redirect('/admin/requests');
  } catch (err) {
    console.error('Error approving question:', err);
    res.status(500).send('Server error');
  }
};

// Delete a pending question
exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    // Find and delete the pending question
    await PendingQuestion.findByIdAndDelete(questionId);

    res.redirect('/admin/requests');
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).send('Server error');
  }
};
