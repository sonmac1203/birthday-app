const express = require('express');
const router = express.Router();
const mongoClient = require('./mongoClient');
const databaseName = 'birthday-project';

router.get('/dates', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    const dates = await dbConnect.collection('dates').find({}).toArray();
    res.send(dates);
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

module.exports = router;
