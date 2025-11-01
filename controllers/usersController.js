const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require('../utils/errors');

// PATCH /users/me — update profile
const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) {
      return next(new NotFoundError('User not found'));
    }
    return res.status(200).send(updatedUser);
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error(err);
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

// Get /users
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
      return next(err);
    });
};

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Synchronous validation
    if (typeof name !== 'string' || name.trim().length < 2) {
      return next(new BadRequestError('Name must be at least 2 characters'));
    }
    if (!email || !validator.isEmail(email)) {
      return next(new BadRequestError('A valid email is required'));
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return next(new BadRequestError('Password must be at least 6 characters'));
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
    /* eslint-disable-next-line no-console */
    console.error(err);
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return next(new ConflictError('Email already exists'));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

// Get current user (GET /users/me)
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(200).send(userObj);
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('User not found'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid user ID'));
      }
      return next(err);
    });
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || typeof password !== 'string' || password.trim() === '') {
      return next(new BadRequestError('Email and password are required'));
    }
    let user;
    try {
      user = await User.findUserByCredentials(email, password);
    } catch (err) {
      return next(new UnauthorizedError('Incorrect email or password'));
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).send({ token });
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error(err);
    return next(err);
  }
};

module.exports = { getUsers, createUser, getCurrentUser, loginUser, updateCurrentUser };
