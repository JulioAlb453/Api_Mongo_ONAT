const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  // Especifica el nombre de la colección (tabla en MongoDB)
  collection: 'Usuarios' // Aquí se especifica el nombre de la colección
});

module.exports = mongoose.model('Usuarios', userSchema);
