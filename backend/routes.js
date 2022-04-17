const express = require('express');
const router = express.Router();
const mongoClient = require('./mongoClient');
const databaseName = 'birthday-project';

router.get('/dates', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    const dates = await dbConnect.collection('dates').find({}).toArray();
    res.status(200).send(dates);
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/createDate', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('dates').insert({
      name: req.query.name,
      description: req.query.description,
      date: req.query.date,
      tag: req.query.tag,
    });
    res.status(200).send('Succesfully create a new date!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

module.exports = router;
