const express = require('express');
const router = express.Router();
const { User, Challenge, UserChallenges, Forum, UserHistory } = require('../models'); // Call name of DB from models folder to use
const { Op } = require("sequelize");
const multer = require('multer');
const yup = require("yup");

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
router.post("/add", async (req, res) => {
  let data = req.body;
  let validationSchema = yup.object({
    date: yup.date().required(),
    challenge: yup.string().trim().max(100).required()
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // make sure date does not overlap
    const existingChallenge = await Challenge.findOne({ where: { date: data.date } });
    if (existingChallenge) {
      return res.status(400).json({ errors: 'A challenge with this date already exists.' });
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
    order: [['date', 'ASC']]
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
    date: yup.date().required(),
    challenge: yup.string().trim().max(100).required()
  });
  try {
    data = await validationSchema.validate(data,
      { abortEarly: false });

    // check for change
    const currentChallenge = await Challenge.findOne({
      where: {
        id: id,
        date: data.date,
        challenge: data.challenge
      }
    });
    if (currentChallenge) {
      return res.status(400).json({ errors: 'No change supplied.' });
    }

    // make sure date does not overlap with other challenges
    const existingChallenge = await Challenge.findOne({
      where: {
        id: { [Op.ne]: id },
        date: data.date
      }
    });
    if (existingChallenge) {
      return res.status(400).json({ errors: 'A challenge with this date already exists.' });
    }

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

router.get("/getDaily", async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {
    let list = await Challenge.findOne({
      where: {
        date: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    if (list) {
      res.json(list);
    } else {
      res.status(404).json({ message: "No challenge found for today!", found: false });
    }
  } catch (error) {
    console.error('Error fetching today\'s challenge:', error);
    res.status(500).json({ message: 'An error occurred while fetching today\'s challenge' });
  }
});

router.post('/completeChallenge', upload.single('image'), async (req, res) => {
  const { userId, challengeId, title, description } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const user = await User.findByPk(userId);
    const challenge = await Challenge.findByPk(challengeId);

    if (!user || !challenge) {
      return res.status(404).json({ message: 'User or Challenge not found!' });
    }

    const existingCompletion = await UserChallenges.findOne({
      where: { user: userId, challenge: challengeId }
    });

    if (existingCompletion) {
      return res.status(400).json({ message: 'User has already completed this challenge!' });
    }

    // Complete the challenge
    await user.addChallenge(challenge, { through: { completedAt: new Date() } });
    await UserHistory.create({
      description: "Completed '" + challenge.challenge +"'",
      points: 20,
      userId: userId
    })

    // Validate forum post data
    const validationSchema = yup.object({
      title: yup.string().trim().min(3).max(100).required(),
      description: yup.string().trim().min(3).max(500).required(),
      image: yup.mixed().required() 
    });

    const forumData = { title: title.trim(), description: description.trim(), image };
    await validationSchema.validate(forumData, { abortEarly: false });

    // Create forum post
    const forumPost = await Forum.create({ ...forumData, userId, challengeId });

    await UserChallenges.update({ forum: forumPost.id }, {
      where: {
        user: userId,
        challenge: challengeId
      }
    });

    res.json({ message: 'Challenge completed and forum post created successfully!', forumPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while completing the challenge and creating the forum post.' });
  }
});

router.get("/getAllCompleted", async (req, res) => {
  let list = await UserChallenges.findAll({
    order: [['completedAt', 'ASC']]
  });
  res.json(list);
});

router.get("/checkCompletion", async (req, res) => {
  const { userId, challengeId } = req.query;
  try {
    const completed = await UserChallenges.findOne({
      where: { user: userId, challenge: challengeId }
    });
    res.json({ completed: !!completed });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while checking challenge completion." });
  }
})

router.get("/countToday", async (req, res) => {
  const { challengeId } = req.query;
  try {
    const completed = await UserChallenges.findAll({
      where: { challenge: challengeId }
    });
    res.json({ count: completed.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while checking today's challenge completion." });
  }
})

router.get("/forumsByDate", async (req, res) => {
  try {
    const date = req.query.date;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required." });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find the challenge for the given date
    const challenge = await Challenge.findOne({
      where: {
        date: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: {
        model: Forum,
        include: {
          model: User,
          attributes: ['username']
        }
      }
    });

    // Check if a challenge was found
    if (!challenge) {
      return res.status(404).json({ message: "No challenge found for the given date." });
    }

    // Return the forums associated with the found challenge
    const forums = challenge.Forums;

    res.json(forums);
  } catch (error) {
    console.error('Error fetching forums by date:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/forumsByCompletionDate', async (req, res) => {
  try {
    const date = req.query.date;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required." });
    }

    // Define start and end of the day for filtering completedAt
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all UserChallenges with the completedAt within the specified date
    const userChallenges = await UserChallenges.findAll({
      where: {
        completedAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      attributes: ['forum']
    });

    if (!userChallenges.length) {
      return res.status(404).json({ message: "No user challenges found for the given date." });
    }

    // Extract forum IDs
    const forumIds = userChallenges.map(uc => uc.forum);

    // Fetch forums by IDs
    const forums = await Forum.findAll({
      where: {
        id: forumIds
      },
      include: {
        model: User,
        attributes: ['username']
      }
    });

    res.json(forums);
  } catch (error) {
    console.error('Error fetching forums by completion date:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;