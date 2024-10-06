const Question = require('../models/Question');

// Fetch and display approved questions
exports.getQuestions = async (req, res) => {
  try {
    const tag = req.query.tag ? req.query.tag.trim() : ''; // Trim any extra spaces
    const query = tag ? { tags: { $regex: tag, $options: 'i' }, status: 'approved' } : { status: 'approved' }; // Only approved questions
    const questions = await Question.find(query);

    // Ensure 'added' is always defined
    const added = req.query.added === 'true'; // Defaults to false if not 'true'
    console.log('added:', added);

    // Pass 'added' to the view
    res.render('index', { mcqs: questions, tag: req.query.tag || '', added });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).send('Server error');
  }
};

// Add a question as a pending request for admin approval
exports.addQuestion = async (req, res) => {
  console.log("accessing .addfunction in mcqController")
  const { question, options, correctAnswer, tags } = req.body;
  try {
    // Convert options and tags to arrays
    const optionsArray = options.split(',').map(option => option.trim());
    const tagsArray = tags.split(',').map(tag => tag.trim());

    // Save the question to the main collection with status 'pending'
    const newQuestion = new Question({
      question,
      options: optionsArray,
      correctAnswer,
      tags: tagsArray,
      status: 'pending',
      createdBy: req.user.id // Assuming req.user is set by authMiddleware
    });

    console.log("question is created")

    await newQuestion.save();
    console.log("question is saved in Qustion model and now redirecting")

    res.redirect('/?added=true'); // Redirect with a success flag
  } 
  catch (err) 
  {
    console.error('Error adding pending question:', err);
    res.status(500).send('Server error');
  }
};

// Fetch all pending questions for admin review
exports.getPendingQuestions = async (req, res) => {
  try {
    const pendingQuestions = await Question.find({ status: 'pending' }).populate('createdBy', 'username email');
    res.render('admin-requests', { pendingQuestions });
  } catch (err) {
    console.error('Error fetching pending questions:', err);
    res.status(500).send('Server error');
  }
};

// Approve a question
exports.approveQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).send('Question not found');
    }

    // Update status to 'approved'
    question.status = 'approved';
    await question.save();

    res.redirect('/mcqs/admin/requests'); // Redirect back to the requests page after approval
  } catch (err) {
    console.error('Error approving question:', err);
    res.status(500).send('Server error');
  }
};

// Delete a pending question
exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).send('Question not found');
    }

    await Question.findByIdAndDelete(questionId);

    res.redirect('/mcqs/admin/requests'); // Redirect back to the requests page after deletion
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).send('Server error');
  }
};
