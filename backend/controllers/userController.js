import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { DEFAULT_LIMIT_VALUE } from '../constants/backendConstans.js';
import generateToken from '../utils/generateToken.js';

// @desc    Otiene el listado de todos los usuarios
// @route   GET /api/users
// @access  private
const getUsers = asyncHandler(async (req, res) => {
  const { offset = 1, limit = DEFAULT_LIMIT_VALUE } = req.query;

  const totalRecords = await User.countDocuments({ isDeleted: false });

  const users = await User.find({ isDeleted: false })
    .select('-password -isDeleted')
    .limit(limit)
    .skip((offset - 1) * limit)
    .exec();

  res.setHeader('X-Total-Count', totalRecords);

  res.status(200).json(users);
});

// @desc    Autentifica un usuario y regresa el usuario con el JWT
// @route   GET /api/users/login
// @access  private
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // busquemos el usuario por email
  const user = await User.findOne({ email: email, isDeleted: false });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Agrega un nuevo usuario y regresa el usuario con el JWT
// @route   POST /api/users
// @access  public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // verificamos que no intentemos agregar un usuario con el mismo email
  const userExists = await User.findOne({ email: email, isDeleted: false });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Actualiza un usuario por id
// @route   PUT /api/users/:id
// @access  private
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;

  // Verificamos si existe el usuario
  const user = await User.findOne({ _id: id, isDeleted: false });

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.user = req.user;
    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Borra lógicamdente un usuario por id
// @route   DELETE /api/users/:id
// @access  private
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Verificamos si existe el usuario
  const user = await User.findOne({ _id: id, isDeleted: false });

  if (user) {
    user.isDeleted = true;
    user.user = req.user;

    // para evitar el BUG de que
    // entre los usuarios borrados haya varios emails iguales,
    // ya que el esquema dice que hay un índice único en: email, isDeleted
    // entonces al email le agregaremos el id al email, con el prefijo, _DELETED_
    user.email = `${user.email}_DELETED_${user._id}`;

    const updatedUser = await user.save();

    if (!updatedUser) {
      res.status(400);
      throw new Error('User not deleted');
    }
  }
  res.sendStatus(200);
});

// @desc    obtiene un usuario por id
// @route   GET /api/users/:id
// @access  private
const getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Verificamos si existe el usuario
  const user = await User.findOne({ _id: id, isDeleted: false });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { getUsers, authUser, registerUser, updateUser, deleteUser, getUser };
