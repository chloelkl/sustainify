const express = require('express');
const router = express.Router();
const { Forum, Event } = require('../models'); // Import models
const { Op } = require("sequelize");

router.get('/events', async (req, res) => {
  try {
    const currentDate = new Date(); // Define currentDate to represent the current date
    let list = await Event.findAll({
      // where: {
      //   eventdate: {
      //     [Op.gte]: currentDate,
      //   }
      // },
      order: [['eventdate', 'ASC']], // Ensure the correct column name casing
      limit: 3, // Limit to 3 upcoming events
    });
    res.json(list);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/forums', async (req, res) => {
  try {
    let list = await Forum.findAll({
      order: [['createdAt', 'DESC']], // Order by the creation date, newest first
      limit: 6, // Limit to 6 forums
    });
    res.json(list);
  } catch (error) {
    console.error('Error fetching forums:', error);
    res.status(500).json({ error: 'Failed to fetch forums' });
  }
});

module.exports = router;
