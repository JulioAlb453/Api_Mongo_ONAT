const { getDB } = require("../../config");
const { ObjectId } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const collection_name = "eventos";

exports.getEvents = async (req, res) => {
  try {
    const db = getDB();
    const event = await db.collection(collection_name).find().toArray();
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
    const newEvent = {
      nombreEvento: req.body.nombreEvento,
      fecha: req.body.fecha,
      hora: req.body.hora,
      lugar: req.body.lugar,
    };
  
    try {
      const db = getDB();
      const result = await db.collection(collection_name).insertOne(newEvent);
      console.log(result)
      res.status(201).json({
        message: "evento creado exitosamente",
        eventId: result.insertedId,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
      
      
    }
  };

exports.getEventById = async (req, res) => {
  const eventId = req.params.id;
  if (!ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "ID de evento no válido" });
  }
  try {
    const db = getDB();
    const user = await db
      .collection(collection_name)
      .findOne({ _id: new ObjectId(eventId) });
    if (!user) {
      return res.status(404).json({ message: "evento no encontrado" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  if (!ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "ID de evento no válido" });
  }
  try {
    const db = getDB();
    const result = await db
      .collection(collection_name)
      .deleteOne({ _id: new ObjectId(eventId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "evento no encontrado" });
    }
    res.json({ message: "evento eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async(req,res) =>{
  const eventId = res.params.id;

  if(!ObjectId.isValid(eventId)){
    return res.status(400).json({menssage: "ID del evento no valido"})
  }

  const updateFields = {}
  if(req.body.nombreEvento) updateFields.nombreEvento = req.body.nombreEvento
  if(req.body.fecha) updateFields.fecha = req.body.fecha
  if(req.body.hora) updateFields.hora = req.body.hora
  if(req.body.lugar) updateFields.lugar = req.body.lugar

  try {
    const db= getDB();
    const result = await db
        .collection(collection_name)
        .updateOne({_id : new ObjectId(eventId)}, {$set: updateFields})
        if(result.matchedCount === 0){
          return res.status(400).json({menssage:"evento no encontrado"})
        }

        res.json({menssage: "Evento Actualizado exitosamente"})
  } catch (err) {
    res.status(500).json({menssage: err.menssage})
  }
}

