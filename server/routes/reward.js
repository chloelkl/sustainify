const express = require('express');
const router = express.Router();
const { Reward } = require('../models'); // Call name of DB from models folder to use
const { Op } = require("sequelize");
const yup = require("yup");


const allowedPoints = [100, 300, 400, 500, 600]

// create
router.post("/", async (req, res) => {
  let data = req.body;
  // Validate request body
  let validationSchema = yup.object({
    rewardname: yup.string().trim().min(3).max(100).required(),
    points: yup.number()
    .oneOf(allowedPoints)
    .required()
  });
  try {
    data = await validationSchema.validate(data,
      { abortEarly: false });
    // Process valid data
    let result = await Reward.create(data);
    res.json(result);
  }
  catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});


// retrieve
router.get("/", async (req, res) => {
  let list = await Reward.findAll({
  });
  res.json(list);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let reward = await Reward.findByPk(id);
  // Check id not found
  if (!reward) {
      res.sendStatus(404);
      return;
  }
  res.json(reward);
});

// update 
router.put("/:id", async (req, res) => {
  let id = req.params.id;
  let reward = await Reward.findByPk(id);
  // Check id not found
  if (!reward) {
      res.sendStatus(404);
      return;
  }
  let data = req.body;
  let validationSchema = yup.object({
    rewardname: yup.string().trim().min(3).max(100),
    points: yup.number().required()

  });
  try {
    data = await validationSchema.validate(data,
      { abortEarly: false });

    let num = await Reward.update(data, {
      where: { id: id }
    });
    if (num == 1) {
      res.json({
        message: "Reward was updated successfully."
      });
    }
    else {
      res.status(400).json({
        message: `Cannot update reward with id ${id}.`
      });
    }
  }
  catch (err) {
    console.error('Error updating reward:', err);
    res.status(400).json({ errors: err.errors });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let num = await Reward.destroy({
    where: { id: id }
  })
  if (num == 1) {
    res.json({
      message: "Reward was deleted successfully."
    });
  }
  else {
    res.status(400).json({
      message: `Cannot delete reward with id ${id}.`
    });
  }
});

module.exports = router;