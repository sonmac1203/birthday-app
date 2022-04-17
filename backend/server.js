require('dotenv').config();
const express = require('express');
const router = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const { MongoClient } = require('mongodb');

router.use(express.json({ extended: false }));
router.use(cors());

const uri = process.env.ATLAS_URI;
const databaseName = 'birthday-project';
const db = new MongoClient(uri);

router.get('/', (req, res) => {
  return res.status(200).json({ msg: 'API connected' });
});

router.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});
