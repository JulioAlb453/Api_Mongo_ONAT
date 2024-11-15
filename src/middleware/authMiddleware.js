const axios = require('axios');
const { API_PYTHON_URL } = process.env; // Asumimos que la URL de la API de Python está en el archivo .env

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
    
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    // Hacer la petición al endpoint de validación de token en tu API de Python
    const response = await axios.post(`${API_PYTHON_URL}/validar-token/`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      // Si el token es válido, guardamos la información del usuario decodificada en req.user
      // req.user = response.data; // Aquí asumes que tu API de Python devuelve la información del usuario
      return next(); // Continuamos con la ruta
    } else {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
  } catch (err) {
    return res.status(400).json({ message: 'Token inválido o expirado...' });
  }
};

module.exports = authenticate;
