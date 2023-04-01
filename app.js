require('dotenv').config();
require('express-async-errors');

// extra security package 
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();

// connect to DataBase
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

// routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// const { required } = require('joi');

// this is for deploying purposes
app.set('trust proxy', 1)

// using extra packages
app.use(rateLimiter({
  window: 15 * 16 * 1000, // 15 minutes
  max: 100 // milit each IP to 100 request per windowMs
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())


// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

// using own middleware/s
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

async function start(){
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => console.log(`http://localhost:${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();