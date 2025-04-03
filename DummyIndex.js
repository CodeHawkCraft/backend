// backend/src/index.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
require('dotenv').config();
require('./config/passport-google');

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB error:', err));

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback route for google => as user grants permission to our app 
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    res.redirect("/");
  }
);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port=process.env.PORT || 3000;
// Auth Routes
app.get('/auth/linkedin', passport.authenticate('linkedin'));
app.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', { session: false }),
  (req, res) => {
    console.log("linkedin callback visited");
  }
);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.redirect(`http://localhost:3001/dashboard?token=${token}`);
  }
);

// Protected Route with asyncHandler
const { authenticateToken } = require('./middleware/auth');
app.get(
  '/api/dashboard',
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Simulate async operation (e.g., fetching user data)
    const user = await User.findById(req.user.id);
    if (!user) throw new Error('User not found');
    res.json({ message: 'Welcome to your recruiter dashboard', user: { id: user.id, role: user.role } });
  })
);

// Error Handling Middleware (catches errors from asyncHandler)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});