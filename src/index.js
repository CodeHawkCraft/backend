const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
require('./config/passport-google');
require('./config/passport-linkedin');
app.use(express.json());
app.use(cors());


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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

