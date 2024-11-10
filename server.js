const express = require('express');
const { connectDB, connectDBPosgres } = require('./config');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
connectDB();
connectDBPosgres();

const userRoutes = require('./src/routes/userRoutes');
const eventsRoutes = require('./src/routes/eventsRoutes');
const productsRoutes = require('./src/routes/productsRoutes')
const donacionesRoutes = require('./src/routes/donacionesRoutes')


app.use('/api/users', userRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/product', productsRoutes);
app.use('/api/donaciones', donacionesRoutes);

app.listen(port, () => {
  console.log(`API activa en http://localhost:${port}`);
});
