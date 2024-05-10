const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./user');

function init() {
  // Local strategy for username/password authentication
  passport.use(User.createStrategy());

  // Google OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ 'googleId': profile.id }, (err, user) => {
          if (err) { return done(err); }
          if (!user) {
            const newUser = new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id
            });
            newUser.save((err) => {
              if (err) console.error(err);
              return done(null, newUser);
            });
          }
          return done(null, user);
        });
      }
    )
  );

  // Facebook OAuth strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ 'facebookId': profile.id }, (err, user) => {
          if (err) { return done(err); }
          if (!user) {
            const newUser = new User({
              username: profile.displayName,
              facebookId: profile.id
            });
            newUser.save((err) => {
              if (err) console.error(err);
              return done(null, newUser);
            });
          }
          return done(null, user);
        });
      }
    )
  );

  // Twitter OAuth strategy
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: 'http://localhost:3000/auth/twitter/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ 'twitterId': profile.id }, (err, user) => {
          if (err) { return done(err); }
          if (!user) {
            const newUser = new User({
              username: profile.displayName,
              twitterId: profile.id
            });
            newUser.save((err) => {
              if (err) console.error(err);
              return done(null, newUser);
            });
          }
          return done(null, user);
        });
      }
    )
  );

  // GitHub OAuth strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/github/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ 'githubId': profile.id }, (err, user) => {
          if (err) { return done(err); }
          if (!user) {
            const newUser = new User({
              username: profile.username,
              githubId: profile.id
            });
            newUser.save((err) => {
              if (err) console.error(err);
              return done(null, newUser);
            });
          }
          return done(null, user);
        });
      }
    )
  );
}

module.exports = { init };
