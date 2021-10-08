import express from 'express'
import logger from 'morgan'
import passport from 'passport'
import cookieSession from 'cookie-session'

import { responseHandler } from './helpers/responseHandler'
import 'regenerator-runtime/runtime.js'
require('./services/passport')

import companyRoute from './routes/company'
import userRoute from './routes/user'
import employeeRoute from './routes/employee'

//const cookieSession = require('cookie-session');
const cors = require('cors')

require('dotenv').config()

//setup the express app
const app = express()

app.use(
  cookieSession({
    name: 'google-auth-session',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
)

// Parse incoming requests data -former function of body-parser
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(
  cors({
    origin: '*',
  })
)

// Log requests to the console.
app.use(logger('dev'))

app.use(passport.initialize())
app.use(passport.session())

// app.use(
//   cookieSession({
//       maxAge: 30*24*60*60*1000,
//       keys: ['cats']
//   })
// );

//define port to run the server
const port = process.env.PORT || 5000

companyRoute(app)
userRoute(app)
employeeRoute(app)

app.get('/', (request, response) => {
  return responseHandler(request, response, 200, { message: 'Home Page' })
})

app.get('*', (request, response) => responseHandler(request, response, 404))

app.post('*', (request, response) => responseHandler(request, response, 404))

app.put('*', (request, response) => responseHandler(request, response, 404))

app.delete('*', (request, response) => responseHandler(request, response, 404))

app.listen(port, () =>
  console.log(`App is running and listening on port ${port}!`)
)
