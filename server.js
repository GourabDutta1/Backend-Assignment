const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./auth');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// Initialize database
db.connect();

// Initialize authentication strategies
auth.init();

// Initialize routes
routes.init(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
