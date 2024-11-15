const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Evento = require("../models/eventModel"); // Asegúrate de que este archivo exporte tu esquema de Mongoose

dotenv.config();

exports.getEvents = async (req, res) => {
  try {
    const events = await Evento.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  console.log(req.body)
  try {
    const { nombreEvento, fecha, horaInicio, horaFinal, descripcion,direccion } = req.body;
    const newEvent = new Evento({
      nombreEvento,
      fecha,
      direccion,
      horaInicio,
      horaFinal,
      descripcion,
    });
    const result = await newEvent.save();
    res.status(201).json({
      message: "evento creado exitosamente",
      eventId: result._id,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  const eventId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "ID de evento no válido" });
  }

  try {
    const event = await Evento.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "evento no encontrado" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "ID de evento no válido" });
  }

  try {
    const result = await Evento.findByIdAndDelete(eventId);
    if (!result) {
      return res.status(404).json({ message: "evento no encontrado" });
    }
    res.json({ message: "evento eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "ID de evento no válido" });
  }

  try {
    const updatedEvent = await Evento.findByIdAndUpdate(eventId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ message: "evento no encontrado" });
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
