const jwt = require('jsonwebtoken'); // Importa la librería jsonwebtoken
// Middleware para verificar el token de autenticación

// Este middleware se encarga de verificar si el token de autenticación es válido
// y si el usuario tiene acceso a la ruta protegida. 
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ msg: 'Acceso denegado. No hay token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = authMiddleware;
