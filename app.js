const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./config/db');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const mcqsRouter = require('./routes/mcqs');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin'); // Import admin routes
const session = require('express-session'); // Import express-session for session management

const app = express();

// Connect to the database
connectDB();

// Set up view engine and layout
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout'); // Set the default layout

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
  secret: 'jwt_secret', // Replace with a secure key
  resave: false,
  saveUninitialized: false
}));

// Middleware to make `user` object available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/mcqs', mcqsRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter); // Use admin routes

module.exports = app;
