const { MongoClient } = require('mongodb');
const {Client} = require('pg')
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const monogoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

const pgClient = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
})

const connectDB = async () => {
  try {
    await monogoClient.connect();
    db = monogoClient.db('cluster-db-onat');//nombre de la base de datos
    console.log('Conectado a la base de datos de mongo..');    
  } catch (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1); 
  }
};

const connectDBPosgres = async ()=>{
  try {
    await pgClient.connect()
    console.log('Conectando con la base de datos de PostgresSQL')
  } catch (error) {
    console.error('Error conectando a la base de datos de PostgreSQL:', err);
    process.exit(1);
  }
}

const transferDataToMongo = async () => {
  try {
    // Consulta a PostgreSQL
    const res = await pgClient.query('SELECT * FROM organizaciones'); 
    const data = res.rows;

    // Inserta datos en MongoDB
    const collection = getDB().collection('users'); // nombre de la colección en MongoDB
    if (data.length > 0) {
      const result = await collection.insertMany(data);
      console.log(`Se insertaron ${result.insertedCount} documentos en MongoDB.`);
    } else {
      console.log('No se encontraron datos en PostgreSQL para transferir.');
    }
  } catch (err) {
    console.error('Error al transferir datos:', err);
  }
};

const getDB = () => db;
module.exports = { connectDB, getDB, connectDBPosgres, transferDataToMongo };
