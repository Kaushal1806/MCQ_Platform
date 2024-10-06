// const jwt = require('jsonwebtoken');

// // Middleware to check if the user is authenticated and, optionally, if the user is an admin
// module.exports = function (requiredAdmin = false) {
//   return function (req, res, next) {

//     console.log("we are inside authmiddleware");
//     next();

//     // Check for token in cookies first, then in the 'x-auth-token' header
//     const token = req.cookies.token || req.header('x-auth-token');
//     console.log('Token:', token); // Debug log

//     // If no token is found, redirect to login or return an error
//     if (!token && !req.session.user) {
//       console.log('No token or session found');
//       return req.header('x-auth-token')
//         ? res.status(401).json({ msg: 'No token, authorization denied' })
//         : res.redirect('/auth/login');
//     }

//     try {
//       // If token exists, verify it
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded:', decoded); // Debug log
//         req.user = decoded.user || decoded;
//       }

//       // If session exists (for admin), assign req.user from session
//       if (req.session.user) {
//         req.user = req.session.user;
//       }

//       // If admin access is required, check if the user is admin
//       if (requiredAdmin && (!req.user || !req.user.isAdmin)) {
//         console.log('Unauthorized: Not an admin');
//         return res.status(403).json({ msg: 'Access denied: Admins only' });
//       }

//       console.log('Proceeding with user:', req.user);
//       next();
//     } catch (err) {
//       console.error('Token verification error:', err.message); // Debug log
//       return res.status(401).json({ msg: 'Token is not valid' });
//     }
//   };
// };

// version 1

// const simpleMiddleware = (req, res, next) => {
//   console.log('Simple middleware executed');
//   // Optionally check for session or token
//   if (!req.session.user) {
//     return res.redirect('/auth/login?error=not-logged-in');
//   }
//   next(); // Proceed to the next middleware or route handler
// };

// module.exports = simpleMiddleware;


// version 2

const jwt = require('jsonwebtoken');

module.exports = function (requiredAdmin = false) {
  return function (req, res, next) {
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
      console.log('No token found. Redirecting to login.');
      return res.redirect('/auth/login');
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Invalid token. Redirecting to login.');
        return res.redirect('/auth/login');
      }

      // Set user in req object if the token is valid
      req.user = decoded.user;
      console.log('Token valid. User:', req.user);

      // If admin access is required, check if the user is an admin
      if (requiredAdmin && !req.session.user.isAdmin) {
        console.log('Admin access required but user is not an admin.');
        return res.status(403).send('Access denied.');
      }

      // Proceed if everything is valid
      console.log('Middleware executed successfully.');
      next();
    });
  };
};



