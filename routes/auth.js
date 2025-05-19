const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registro de uusuario
// Este endpoint permite registrar un nuevo usuario en la base de datos.
router.post('/register', async (req, res) => {
  const {
    nombre,
    apellido,
    tipo_documento,
    documento,
    fecha_de_nacimiento,
    email,
    password,
    rol
  } = req.body;
  // Validar los campos requeridos
  try {
    // Verificar si el usuario ya existe por correo o documento
    const userExists = await User.findOne({ $or: [{ email }, { documento }] });
    if (userExists) return res.status(400).json({ msg: 'El usuario ya existe' });

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario con todos los campos
    const newUser = new User({
      nombre,
      apellido,
      tipo_documento,
      documento,
      fecha_de_nacimiento,
      email,
      password: hashedPassword,
      rol // opcional, si no viene, usa el valor por defecto ("user")
    });

    await newUser.save();

    res.status(201).json({ msg: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { documento, password } = req.body;

  try {
    const user = await User.findOne({ documento }); // Verificamos si el usuario existe
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);// Comparamos la contraseña ingresada con la almacenada en la base de datos
    // Si la contraseña no coincide, enviamos un mensaje de error
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });// Creamos un token JWT con el id del usuario y lo firmamos con una clave secreta
    // El token tiene una validez de 1 hora

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = router;

// Profile
// Este endpoint permite obtener la información del perfil del usuario autenticado
// Solo se puede acceder a este endpoint si el usuario está autenticado
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user);
  res.json(user);
});1