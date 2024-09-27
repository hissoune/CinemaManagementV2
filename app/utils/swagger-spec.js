const swaggerJSDoc = require('swagger-jsdoc');

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


module.exports = swaggerSpec;
