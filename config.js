const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

let db;


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Conectado a la base de datos de MongoDB usando Mongoose..");
  } catch (err) {
    console.error(
      "Error conectando a la base de datos de MongoDB con Mongoose:",
      err
    );
    process.exit(1);
  }
};




const getDB = () => db;
module.exports = { connectDB, getDB, };
