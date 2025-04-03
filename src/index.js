const express = require('express');
const app = express();
const cors = require('cors');
const connectDb=require('./config/db');
const {errorHandler}=require('./utils');
require('dotenv').config();
require('./config/passport');


async function startServer(){
  await connectDb();

  app.use(express.json());
  app.use(cors());

  const port = process.env.PORT || 3000;

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.use('/api',require('./routes'));
  
  // error handling middleware => must be after all routes
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

}

startServer();