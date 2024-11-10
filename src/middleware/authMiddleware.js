const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticate = (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Decodificamos el token y lo almacenamos en req.user
    next();  // El token es válido, continuamos con la ruta
  } catch (err) {
    return res.status(400).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authenticate;
