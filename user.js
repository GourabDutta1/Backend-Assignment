const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  profile: {
    name: String,
    bio: String,
    phone: String,
    photo: String,
    public: { type: Boolean, default: true },
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
