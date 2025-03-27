// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Use the routes (each route file handles a specific type of route)

//auth
const authRoutes = require('./routes/auth'); // Import auth routes
app.use('/', authRoutes); // All authentication-related routes

//products
const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

//cart
const cart = require('./routes/cartRoute');
app.use('/cart',cart);

//order
const order = require('./routes/orderRoutes');
app.use('/order',order);

//payment
const paymentRoutes = require('./routes/payment');
app.use('/payment', paymentRoutes);

//job
const job = require('./routes/labourRoute');
app.use('/job',job);

//rental
// Routes
const equipmentRoutes = require("./routes/equipmentRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

app.use("/equipment", equipmentRoutes);
app.use("/rentals", rentalRoutes);

//weather
const weatherRoutes = require('./routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
