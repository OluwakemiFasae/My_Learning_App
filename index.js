import express from 'express';
import logger from 'morgan';
import passport from 'passport';
import cookieSession from 'cookie-session';


require('./services/passport')

import companyRoute from './routes/company';
import userRoute from './routes/user';
import employeeRoute from './routes/employee';

//const cookieSession = require('cookie-session');


require('dotenv').config()



//setup the express app
const app = express()

app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2']
}))

// Parse incoming requests data -former function of body-parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Log requests to the console.
app.use(logger('dev'));

app.use(passport.initialize());
app.use(passport.session());

// app.use(
//   cookieSession({
//       maxAge: 30*24*60*60*1000,
//       keys: ['cats']
//   })
// );




//define port to run the server
const port = process.env.PORT || 5000;




companyRoute(app);
userRoute(app);
employeeRoute(app);

app.get('/', (req, res) => 
    res.status(200).send({ message: 'Home Page' }))

app.listen(port, () => 
    console.log(`App is running and listening on port ${port}!`))