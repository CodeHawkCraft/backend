const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const usenModel = require('../model/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await usenModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await usenModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            authProvider: 'google',
            role: 'recruiter',
            password: 'oauth-no-password',
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;