// Middleware que permite recibir y procesar datos en formato JSON en el cuerpo de las solicitudes HTTP
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión', err));

// Rutas para autenticar
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Iniciar servidor Express 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));