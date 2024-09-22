const express = require('express');
const connectDB = require('./app/config/db');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const userRoutes = require('./app/routes/userRoutes');



app.use('/api', userRoutes); 





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
