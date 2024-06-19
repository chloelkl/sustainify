const express = require('express');
const router = express.Router();
const { Challenge } = require('../models'); // Call name of DB from models folder to use
const { Op } = require("sequelize");
const yup = require("yup");

// create
router.post("/add", async (req, res) => {
  let data = req.body;
  let validationSchema = yup.object({
    challenge: yup.string().trim().min(3).max(100).required(),
    date: yup.date().required()
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // make sure date does not overlap
    const existingChallenge = await Challenge.findOne({ where: { date: data.date } });
    if (existingChallenge) {
      return res.status(400).json({ error: 'A challenge with this date already exists.' });
    }

    let result = await Challenge.create(data); // .create() used to insert data into DB table
    res.json(result);
  }
  catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// retrieve
router.get("/get", async (req, res) => {
  let list = await Challenge.findAll({
    order: [['date', 'ASC']] // The list of all items in DB, either in DESC or ASC order
  });
  res.json(list);
});

// update
router.put("/update/:id", async (req, res) => {
  let id = req.params.id;
  // check id
  let challenge = await Challenge.findByPk(id);
  if (!challenge) {
    res.sendStatus(404);
    return;
  }

  let data = req.body;
  // Validate request body
  let validationSchema = yup.object({
    challenge: yup.string().trim().min(3).max(100).required(),
    date: yup.date().required()
  });
  try {
    data = await validationSchema.validate(data,
      { abortEarly: false });

    let num = await Challenge.update(data, {
      where: { id: id }
    });
    if (num == 1) {
      res.json({
        message: "Challenge was updated successfully."
      });
    }
    else {
      res.status(400).json({
        message: `Cannot update challenge with id ${id}.`
      });
    }
  }
  catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// delete
router.delete("/delete/:id", async (req, res) => {
  let id = req.params.id;
  // Check id not found
  let challenge = await Challenge.findByPk(id);
  if (!challenge) {
    res.sendStatus(404);
    return;
  }

  let num = await Challenge.destroy({
    where: { id: id }
  })
  if (num == 1) {
    res.json({
      message: "Challenge was deleted successfully."
    });
  }
  else {
    res.status(400).json({
      message: `Cannot delete challenge with id ${id}.`
    });
  }
});

module.exports = router;