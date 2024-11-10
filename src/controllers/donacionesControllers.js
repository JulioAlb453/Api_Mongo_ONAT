const { getDB } = require("../../config");
const { ObjectId } = require("mongodb");
const dotenv = require("dotenv");
// const crypto = require("crypto");

dotenv.config();
const collection_name = 'Donaciones'

exports.getDonaciones = async(req,res) =>{
    try {
        const db= getDB()
        const donacion = await db.collection(collection_name).find().toArray();
        res.status(200).json(donacion)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message });
    }
}

exports.createDonacion = async (req, res) => {
  const newDonacion = {
    nombreDonador: req.body.nombreDonador,
    APaterno: req.body.APaterno,
    AMaterno: req.body.AMaterno,
    monto: req.body.monto,
    correoElectronico: req.body.correoElectronico,
  };
  try {
    const db = getDB();
    const result = await db.collection(collection_name).insertOne(newDonacion);
    res.status(201).json({
      menssage: "donacion realizado correctamente",
      donacionId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ menssage: error.menssage });
  }
};

exports.getDonacionById = async (req,res)=>{
    const donacionId = req.params.id;

    if(!ObjectId.isValid(donacionId)){
        res.status(400).json({menssage: "ID de donación no es valido"})
    }
    try {
        const db = getDB()
        const user = await db
        .collection(collection_name)
        .findOne({_id: new ObjectId(donacionId)})
        if(!user){
            res.status(404).json({menssage: "Doncion no encontrada"})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({menssage: error.menssage})
    }
}
