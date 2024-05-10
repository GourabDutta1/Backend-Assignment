const passport = require('passport');
const User = require('./user');

function init(app) {
  // Authentication endpoints
  app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const newUser = new User({ username, email });
    User.register(newUser, password, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error registering user');
      }
      return res.status(200).send('User registered successfully');
    });
  });

  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).send('Login successful');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send('Logged out successfully');
  });
  
  app.get('/', (req, res) => {
    res.send('Welcome to the API homepage');
  });
  
  // Google OAuth callback route
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect or respond as needed
      res.redirect('/');
    });

  // Facebook OAuth callback route
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect or respond as needed
      res.redirect('/');
    });

  // Twitter OAuth callback route
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect or respond as needed
      res.redirect('/');
    });

  // GitHub OAuth callback route
  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect or respond as needed
      res.redirect('/');
    });

  // Profile endpoints
  app.get('/profile', isAuthenticated, (req, res) => {
    // Check if user is admin
    if (req.user.role === 'admin') {
      // Admins can access all profiles
      User.find({}, 'profile', (err, users) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error retrieving profiles');
        }
        return res.status(200).json(users.map(user => user.profile));
      });
    } else {
      // Normal users can only access public profiles
      User.find({ 'profile.public': true }, 'profile', (err, users) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error retrieving profiles');
        }
        return res.status(200).json(users.map(user => user.profile));
      });
    }
  });

  app.put('/profile', isAuthenticated, (req, res) => {
    // Check if user is admin
    if (req.user.role === 'admin' || req.user._id.equals(req.body.userId)) {
      const { name, bio, phone, photo, public } = req.body;
      req.user.profile.name = name;
      req.user.profile.bio = bio;
      req.user.profile.phone = phone;
      req.user.profile.photo = photo;
      req.user.profile.public = public;
      req.user.save((err, savedUser) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error saving profile');
        }
        return res.status(200).json(savedUser.profile);
      });
    } else {
      return res.status(403).send('Forbidden');
    }
  });

  // Middleware function to check if user is authenticated
  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send('Unauthorized');
  }
}

module.exports = { init };