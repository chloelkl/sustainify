const express = require('express');
const router = express.Router();
const { Reward, RewardUser } = require('../models'); // Call name of DB from models folder to use
const yup = require("yup");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const allowedPoints = [100, 300, 400, 500, 600]

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
})

const upload = multer({ storage: storage });

// create
router.post("/", upload.single('rewardImage'), async (req, res) => {
  let data = req.body;
  let validationSchema = yup.object({
    rewardname: yup.string().trim().min(3).max(100).required(),
    points: yup.number()
      .oneOf(allowedPoints)
      .required()
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });

    if (req.file) {
      data.rewardImage = req.file.path;
    }

    let result = await Reward.create(data);
    res.json(result);
  } catch (err) {
    console.error('Validation or database error:', err);
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/getAllRedeemed", async (req, res) => {
  let list = await RewardUser.findAll({
    order: [['redeemedAt', 'ASC']] 
  });
  res.json(list);

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
router.put("/:id", upload.single('rewardImage'), async (req, res) => {
  let id = req.params.id;
  let reward = await Reward.findByPk(id);

  // Check if reward with the given id exists
  if (!reward) {
      res.sendStatus(404);
      return;
  }

  // Handle file upload and delete the old image if a new one is uploaded
  if (req.file) {
      if (reward.rewardImage) {
          const oldImagePath = path.resolve(reward.rewardImage);
          if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath); // Delete the old image
          }
      }
      reward.rewardImage = req.file.path; // Update image path
  }

  let data = req.body;
  let validationSchema = yup.object({
      rewardname: yup.string().trim().min(3).max(100),
      points: yup.number().required()
  });

  try {
      data = await validationSchema.validate(data, { abortEarly: false });

      let num = await Reward.update(data, {
          where: { id: id }
      });

      if (num == 1) {
          // Save the updated reward including the new image path
          await reward.save();
          res.json({
              message: "Reward was updated successfully."
          });
      } else {
          res.status(400).json({
              message: `Cannot update reward with id ${id}.`
          });
      }
  } catch (err) {
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