const express = require('express');
const router = express.Router();
const mongoClient = require('./mongoClient');
const ObjectId = require('mongodb').ObjectId;
const databaseName = 'birthday-project';

router.get('/events', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    const events = await dbConnect.collection('events').find({}).toArray();
    res.status(200).send(events);
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/createEvent', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('events').insertOne({
      name: req.query.name,
      description: req.query.description,
      date: req.query.date,
      tag: req.query.tag,
      added: true,
    });
    res.status(200).send('Successfully create a new event!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/updateEvent', async (req, res) => {
  try {
    let updateBlock = {};
    if (req.query.name) {
      updateBlock['name'] = req.query.name;
    }
    if (req.query.description) {
      updateBlock['description'] = req.query.description;
    }
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('events').updateOne(
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
      pinned: false,
    });
    res.status(200).send('Successfully create a new date!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/pinNote', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('notes').updateOne(
      {
        pinned: true,
      },
      {
        $set: {
          pinned: false,
        },
      }
    );
    dbConnect.collection('notes').updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: {
          pinned: true,
        },
      }
    );
    res.status(200).send('Successfully pin the note');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

module.exports = router;
