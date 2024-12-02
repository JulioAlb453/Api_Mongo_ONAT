const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
nombreEvento: { type: String, required: true },
fecha: { type: String, required: true, },
direccion: { type: String, required: true },
horaInicio: { type: String, required: true },
horaFinal: { type: String, required: true },
descripcion: { type: String, required: true } ,
idOrg: { type: String, required: true } ,
}, {
  collection: 'events' 
});

module.exports = mongoose.model('events', eventsSchema);
