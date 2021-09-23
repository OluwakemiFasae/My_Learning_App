import express from 'express';
import logger from 'morgan';
import passport from 'passport';
import cookieSession from 'cookie-session';


import './services/passport'
import adminRoute from './routes/admin';


require('dotenv').config()



//setup the express app
const app = express()



// Log requests to the console.
app.use(logger('dev'));


app.use(
  cookieSession({
      maxAge: 30*24*60*60*1000,
      keys: [process.env.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());


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