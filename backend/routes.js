const express = require('express');
const router = express.Router();
const mongoClient = require('./mongoClient');
const ObjectId = require('mongodb').ObjectId;
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
    dbConnect.collection('dates').insertOne({
      name: req.query.name,
      description: req.query.description,
      date: req.query.date,
      tag: req.query.tag,
    });
    res.status(200).send('Successfully create a new date!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/updateDate', async (req, res) => {
  try {
    let updateBlock = {};
    if (req.query.name) {
      updateBlock['name'] = req.query.name;
    }
    if (req.query.description) {
      updateBlock['description'] = req.query.description;
    }
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('dates').updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: updateBlock,
      }
    );
    res.status(200).send('Successfully update a date!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/addPhoto', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('gallery').insertOne({
      url: req.query.url,
      description: req.query.description,
      date: req.query.date,
      location: req.query.location,
    });
    res.status(200).send('Successfully added a new photo to gallery!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.get('/gallery', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    const photos = await dbConnect.collection('gallery').find({}).toArray();
    res.status(200).send(photos);
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.get('/notes', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    const notes = await dbConnect.collection('notes').find({}).toArray();
    res.status(200).send(notes);
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/createNote', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('notes').insertOne({
      description: req.query.description,
      date: req.query.date,
    });
    res.status(200).send('Successfully create a new date!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

module.exports = router;
