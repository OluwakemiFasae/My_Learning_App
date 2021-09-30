require('dotenv').config();

module.exports = {
  development: {
    "username": "postgres",
    "password": process.env.DB_PASSWORD_DEV,
    "database": process.env.DB_NAME_DEV,
    "host": process.env.HOST_DEV,
    "dialect": "postgres"
  },

 production: {
    "username": process.env.DB_USERNAME_PROD,
    "password": process.env.DB_PASSWORD_PROD,
    "database": process.env.DB_NAME_PROD,
    "host": process.env.DB_HOST_PROD,
    "dialect": "postgres"
  }
}

