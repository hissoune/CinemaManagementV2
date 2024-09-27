const express = require('express');
const connectDB = require('./app/config/db');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./app/utils/swagger-spec');

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
