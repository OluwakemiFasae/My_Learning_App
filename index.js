import express from 'express';
import logger from 'morgan';

require('dotenv').config()

import adminRoute from './routes/admin';


//setup the express app
const app = express()



// Log requests to the console.
app.use(logger('dev'));

//define port to run the server
const port = 5000

// Parse incoming requests data -former function of body-parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

adminRoute(app);

app.get('/', (req, res) => 
    res.status(200).send({ message: 'Home Page' }))

app.listen(port, () => 
    console.log(`App is running and listening on port ${port}!`))