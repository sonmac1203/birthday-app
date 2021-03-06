require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json({ extended: false }));
const mainRoutes = require('./routes');
const dbo = require('./mongoClient');
app.use(mainRoutes);
const path = require('path');

app.get('/', (req, res) => {
  return res.status(200).json({ msg: 'API connected' });
});

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
