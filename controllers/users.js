const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

// PATCH /users/me — update profile
const updateCurrentUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};
// Get /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};



const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Synchronous validation
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).send({ message: 'Name must be at least 2 characters' });
    }
    if (!email || !validator.isEmail(email)) {
      return res.status(400).send({ message: 'A valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).send({ message: 'Password must be at least 6 characters' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    // Never return password in response
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(201).send(userObj);
  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).send({ message: 'Email already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};


// Get current user (GET /users/me)
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(200).send(userObj);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID" });
      }
      return res.status(500).send({ message: err.message });
    });
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).send({ message: 'Email and password are required' });
    }
    let user;
    try {
      user = await User.findUserByCredentials(email, password);
    } catch (err) {
      return res.status(401).send({ message: 'Incorrect email or password' });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};

module.exports = { getUsers, createUser, getCurrentUser, loginUser, updateCurrentUser };