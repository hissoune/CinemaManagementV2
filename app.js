const express = require('express');
const connectDB = require('./app/config/db');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const userRoutes = require('./app/routes/userRoutes');
const authRoutes = require('./app/routes/authRoute');
const movieRoutes = require('./app/routes/movieRoutes');



app.use('/api', userRoutes); 

app.use('/api', authRoutes); 

app.use('/api/movies', movieRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
