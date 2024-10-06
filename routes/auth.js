const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup route
router.get('/signup', (req, res) => {
  const error = req.query.error || null;
  res.render('signup', { title: 'Sign Up', action: '/auth/signup', error });
});

router.post('/signup', authController.register);

// Login route
router.get('/login', (req, res) => {
  console.log('Login route accessed');
  const error = req.query.error || null;
  res.render('login', { title: 'Login', action: '/auth/login', error });
});

router.post('/login', authController.login);

router.get('/logout', (req, res) => {
  console.log("Logout route accessed");

  // Clear the JWT token cookie
  res.clearCookie('token', { path: '/' });

  // Destroy the session (clears the connect.sid cookie)
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).send('Server error');
    }

    // Clear the session ID cookie (connect.sid) explicitly
    // Ensure the same options (domain, path, etc.) are used as when it was set
    res.clearCookie('connect.sid', { 
      path: '/', 
      httpOnly: true, 
      secure: false,  // set to `true` if in production with HTTPS
      sameSite: 'Lax' // or `None` if in production
    });

  // Redirect to the homepage or login page after logout
  res.redirect('/');
  });
});



// router.get('/logout', (req, res) => {
//   // Destroy the session
//   console.log("logout route hit")
//   // req.session.destroy(err => {
//   //   if (err) {
//   //     console.error('Error during logout:', err);
//   //     return res.status(500).send('Server error');
//   //   }
    
//   // });
//   // res
//   //   .status(200)
//   //   .cookie("token", "", {
//   //     expires: new Date(Date.now()),
//   //     sameSite: process.env.NODE_ENV === "Develpoment" ? "lax" : "none",
//   //     secure: process.env.NODE_ENV === "Develpoment" ? false : true,
//   //   })
//   //   .redirect('/'); // Redirect to the login page after logout


//   res.cookie('authToken', '', { expires: new Date(Date.now() - 864e5), path: '/' });
//   res.cookie('sessionId', '', { expires: new Date(Date.now() - 864e5), path: '/' });

//     // Redirect to the home page
//   res.redirect('/');

  
// });


module.exports = router;
