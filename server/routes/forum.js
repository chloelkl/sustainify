const express = require('express');
const router = express.Router();
const { Forum, User, SavedForum } = require('../models'); // Call name of DB from models folder to use
const { Op } = require("sequelize");
const yup = require("yup");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

// Router to save forum liked
router.post('/save-forum', async (req, res) => {
    try {
      const { title, description, image, username, createdDate, userId } = req.body;
  
      const newForum = await SavedForum.create({
        title,
        description,
        image,
        username,
        createdDate,
        userId,
      });
  
      res.status(200).json(newForum);
    } catch (error) {
      console.error('Error saving forum:', error);
      res.status(500).json({ error: 'Failed to save forum' });
    }
  });

// Router to get saved forums
router.get('/saved-forums/:userId', async (req, res) => {
try {
    const { userId } = req.params;
    const savedForums = await SavedForum.findAll({ where: { userId } });

    res.status(200).json(savedForums);
} catch (error) {
    console.error('Error fetching saved forums:', error);
    res.status(500).json({ error: 'Failed to fetch saved forums' });
}
});

// Route to create a new forum
router.post("/", upload.single('image'), async (req, res) => {
    let data = req.body;
    // Validate request body -> Update Details of request body to match fields defined in DB
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
        // No need to validate 'image' field here as it is handled by Multer
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        if (req.file) {
            data.image = req.file.path; // Save the image path in the database
        }
        let result = await Forum.create(data); // .create() used to insert data into DB table
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Route to get all forums
router.get("/", async (req, res) => {
    try {
        let condition = {};
        let search = req.query.search;
        if (search) {
            condition[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }, // Adjust to match DB fields
            ];
        }

        const forums = await Forum.findAll({
            where: condition,
            include: {
                model: User,
                attributes: ['username'],
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(forums);
    } catch (error) {
        console.error('Error fetching forums:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to find a forum by Id
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let forum = await Forum.findByPk(id);
    // Check id not found
    if (!forum) {
        res.sendStatus(404);
        return;
    }
    res.json(forum);
});

// Route to get forums for a specific user
router.get("/by/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const forums = await Forum.findAll({
            where: { userId },
            include: {
                model: User,
                attributes: ['username']
            },
        });
        res.json(forums);
    } catch (error) {
        console.error('Error fetching forums:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to update a forum
router.put("/:userId/:id", upload.single('image'), async (req, res) => {
    const { userId, id } = req.params;
    console.log('UserId:', userId, 'ForumId:', id);

    const { title, description } = req.body;

    try {
        const forum = await Forum.findByPk(id);

        if (!forum) {
            return res.status(404).json({ error: 'Forum not found' });
        }

        if (req.file) {
            if (forum.image) {
                const oldImagePath = path.resolve(forum.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image
                }
            }
            forum.image = req.file.path; // Update image path
        }

        forum.title = title;
        forum.description = description;

        await forum.save();

        res.json(forum);
    } catch (error) {
        console.error("Error updating forum:", error);
        res.status(500).json({ error: "An error occurred while updating the forum" });
    }
});

// Route to delete a forum
router.delete("/:userId/:id", async (req, res) => {
    const { userId, id } = req.params;
    console.log('UserId:', userId, 'ForumId:', id);

    try {
        const forum = await Forum.findByPk(id);

        if (!forum) {
            return res.status(404).json({ error: 'Forum not found' });
        }

        if (forum.image) {
            const imagePath = path.resolve(forum.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the old image
            }
        }

        await Forum.destroy({ where: { id:id } });

        res.json({ message: "Forum was deleted successfully." });
    } catch (error) {
        console.error("Error deleting forum:", error);
        res.status(500).json({ error: `An error occurred while deleting the forum with id ${id}` });
    }
});

module.exports = router;
