const dotenv = require("dotenv");
const express = require("express");
const { connectDB } = require("./config");
const eventsRoutes = require("./src/routes/eventsRoutes");
const productsRoutes = require("./src/routes/productsRoutes");
const cors = require('cors');

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 
}


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());
connectDB();


app.use("/api/events", eventsRoutes);
app.use("/api/product", productsRoutes);

app.listen(port, () => {
  console.log(`API activa en http://localhost:${port}`);
});
