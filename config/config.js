require('dotenv').config();

export const development = {
    "username": "postgres",
    "password": process.env.DB_PASSWORD_DEV,
    "database": process.env.DB_NAME_DEV,
    "host": process.env.HOST_DEV,
    "dialect": "postgres"
  }

 export const production =  {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
