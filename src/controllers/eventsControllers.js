const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Evento = require("../models/eventModel"); 
const { Client } = require("pg");
dotenv.config();

const pgClient = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pgClient
  .connect()
  .then(() => console.log("Conectado a la base de datos de PostgreSQL"))
  .catch((err) => console.error("Error conectando a PostgreSQL:", err));

exports.getEvents = async (req, res) => {
  try {
    const events = await Evento.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      nombreEvento,
      fecha,
      horaInicio,
      horaFinal,
      descripcion,
      direccion,
      idOrg,
    } = req.body;
    const newEvent = new Evento({
      nombreEvento,
      fecha,
      direccion,
      horaInicio,
      horaFinal,
      descripcion,
      idOrg,
    });
    console.log(newEvent.idOrg)
    const result = await newEvent.save();
    res.status(201).json({
      message: "evento creado exitosamente",
      eventId: result._id,
    });
  } catch (err) {
    console.log(err);
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

exports.getEventsWithOrg = async (req, res) => {
  const orgId = req.params.id;
  try {
    const orgQuery = 'Select * From "Onat".organizations WHERE id = $1';
    const orgResult = await pgClient.query(orgQuery, [orgId]);
    const orgData = orgResult.rows[0];
    const events = await Evento.find({ idOrg: orgId });
    orgData.events = events
    res.status(200).json(orgData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ menssage: err.menssage });
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
