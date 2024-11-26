const http = require("http");
const app = require("./src/app");
const Model = require("./src/app/models");
require('dotenv').config();

const server = http.createServer(app);
const env = process.env.ENV || 'dev';
const config = require('./src/app/config/config.json')[env]
const PORT = config.PORT;

server.listen(PORT, () => {
  console.warn(`server running on port ${PORT}.`);
});

// Model.sequelize.sync({ alter: true }) // Use { force: true } only during development to drop and recreate tables
//   .then(() => {
//     console.warn("Database synced successfully");
//     server.listen(PORT, () => {
//       console.warn(`Server is running on port ${PORT}.`);
//     });
//   })
//   .catch((err) => {
//     console.error("Error syncing database:", err);
//   });

