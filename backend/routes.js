const express = require('express');
const router = express.Router();
const mongoClient = require('./mongoClient');
const ObjectId = require('mongodb').ObjectId;
const databaseName = 'birthday-project';

router.get('/api/events', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    const events = await dbConnect
      .collection('events')
      .find({})
      .sort({ date: -1 })
      .toArray();
    res.status(200).send(events);
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/api/createEvent', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('events').insertOne({
      name: req.query.name,
      description: req.query.description,
      date: new Date(req.query.date),
      tag: req.query.tag,
      added: true,
    });
    res.status(200).send('Successfully create a new event!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/api/updateEvent', async (req, res) => {
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

router.post('/api/addPhoto', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('gallery').insertOne({
      url: req.query.url,
      description: req.query.description,
      date: new Date(req.query.date),
      location: req.query.location,
    });
    res.status(200).send('Successfully added a new photo to gallery!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.delete('/api/deletePhoto', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('gallery').deleteOne({ _id: ObjectId(req.query.id) });
    res.status(200).send('Successfully delete the photo');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.get('/api/gallery', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    const photos = await dbConnect
      .collection('gallery')
      .find({})
      .sort({ date: -1 })
      .toArray();
    res.status(200).send(photos);
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.get('/api/notes', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    const notes = await dbConnect
      .collection('notes')
      .find({})
      .sort({ date: -1 })
      .toArray();
    res.status(200).send(notes);
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/api/createNote', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('notes').insertOne({
      title: req.query.title,
      description: req.query.description,
      date: new Date(req.query.date),
      pinned: false,
    });
    res.status(200).send('Successfully create a new note!');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

router.post('/api/pinNote', async (req, res) => {
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

router.delete('/api/deleteNote', async (req, res) => {
  try {
    const dbConnect = await mongoClient.getDb(databaseName);
    dbConnect.collection('notes').deleteOne({ _id: ObjectId(req.query.id) });
    res.status(200).send('Successfully delete the note');
  } catch (err) {
    console.log(err);
    res.status(500).send('A database error has occured');
  }
});

module.exports = router;
