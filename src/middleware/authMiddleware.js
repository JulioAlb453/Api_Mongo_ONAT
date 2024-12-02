const axios = require('axios');
const { API_PYTHON_URL } = process.env; 
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
    
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const response = await axios.post(`${API_PYTHON_URL}/organizaciones/validar-token/`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      return next(); 
    } else {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
  } catch (err) {
    return res.status(400).json({ message: 'Token inválido o expirado...' });
  }
};

module.exports = authenticate;
