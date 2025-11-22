const mongoose = require("mongoose");
const validator = require("validator");

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must provide a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'You must provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },

});

// Custom static method for login
userSchema.statics.findUserByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Incorrect email or password');
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new Error('Incorrect email or password');
  }
  return user;
};

module.exports = mongoose.model("user", userSchema);