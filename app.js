const express = require('express');
const connectDB = require('./app/config/db');
require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();
const verifyToken = require('./app/midlwares/verifyToken');
const adminRoutes = require('./app/routes/adminRoutes');
const authRoutes = require('./app/routes/authRoute');
const movieRoutes = require('./app/routes/movieRoutes');
const roomRoutes = require('./app/routes/roomRoutes');
const sessionRoutes = require('./app/routes/sessionRoutes');
const reservationRoutes = require('./app/routes/reservationRoutes');

app.use('/api/auth', authRoutes);

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Cinema management",
    version: "0.1.0",
description: "This API provides functionality for managing a cinema. It includes endpoints for managing movies, bookings, showtimes, rooms, and user roles (admin and client). It supports operations like creating, updating, and deleting data related to these resources, as well as user authentication and seat reservation for movie sessions.",
    contact: {
      name: "KHALID HISSOUNE",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
};
const options = {
  swaggerDefinition,
  apis: ['./docs/**/*.yaml'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(verifyToken);


app.use('/api/admins', adminRoutes); 


app.use('/api/movies', movieRoutes);

app.use('/api/rooms', roomRoutes);

app.use('/api/sessions', sessionRoutes);


app.use('/api/reservations', reservationRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
