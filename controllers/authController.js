const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    console.log(`Attempting to register user: ${trimmedUsername}`);
    
    // Check if the user already exists
    let user = await User.findOne({ username: trimmedUsername });
    if (user) {
      console.log(`User already exists: ${trimmedUsername}`);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({ username: trimmedUsername, email });

    // Hash the password before saving
    // const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(trimmedPassword, 10);
    console.log(`Hashed password before save: ${user.password}`);

    // Log right before saving
    console.log(`Saving user: ${trimmedUsername} with password hash: ${user.password}`);
    
    // Save the user to the database
    await user.save();
    console.log(`User registered successfully: ${trimmedUsername}`);

    // Redirect to login after successful signup
    res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Static admin credentials for now
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123' // You should use environment variables
};



// Login User
exports.login = async (req, res) => {
  console.log('Received login payload:', req.body); 
  const { username, password } = req.body;

  // Check if the user is the admin
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Handle admin login
    req.session.user = { username, isAdmin: true };
    console.log('Session user set:', req.session.user);
    return res.redirect('/');
  }

  try {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Log the username and  password entered for login
    console.log(`Attempting to log in user: ${trimmedUsername}`);
    console.log(`Password entered: ${trimmedPassword}`);

    // Check if the user exists
    let user = await User.findOne({ username: trimmedUsername });
    if (!user) {
      console.log(`User not found: ${trimmedUsername}`);
      return res.redirect('/auth/signup?error=user-not-found');
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);

    if (!isMatch) {
      console.log(`Invalid credentials for user: ${trimmedUsername}`);
      return res.redirect('/auth/login?error=invalid-credentials');
    }
    // Create a JWT payload
    const payload = { user: { id: user.id } };

    // Sign and return the JWT token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;

      console.log('Generated Token:', token); // Debug log
      res.cookie('token', token, { httpOnly: true }); // Set the token as an HTTP-only cookie

      // Set the session user object
      req.session.user = { id: user._id, username: user.username, email: user.email };
      console.log('Session user set:', req.session.user);

      res.redirect('/');
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

