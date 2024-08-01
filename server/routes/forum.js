const express = require('express');
const router = express.Router();
const { Forum, User } = require('../models'); // Call name of DB from models folder to use
const { Op } = require("sequelize");
const yup = require("yup");

// Route to create a new forum
router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body -> Update Details of request body to match fields defined in DB
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Forum.create(data); // .create() used to insert data into DB table
        res.json(result);
    }
    catch (err) {
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
                { name: { [Op.like]: `%${search}%` } },
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } } // Adjust to match DB fields
            ];
        }

        const forums = await Forum.findAll({
            where: condition,
            include: {
                model: User,
                attributes: ['username']
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
router.put("/:userId/:id", async (req, res) => {
    const { userId, id } = req.params; // Extract both userId and id from the route parameters
    console.log('UserId:', userId, 'ForumId:', id);

    const { title, description } = req.body;

    try {
        const forum = await Forum.findByPk(id);

        // Check if the forum was found
        if (!forum) {
            res.sendStatus(404);
            return;
        }

        // Update the forum with new data
        forum.title = title;
        forum.description = description;

        // Save the updated forum
        await forum.save();

        // Send back the updated forum as a response
        res.json(forum);
    } catch (error) {
        console.error("Error updating forum:", error);
        res.status(500).json({ error: "An error occurred while updating the forum" });
    }
});

// Route to delete a forum
// Route to delete a forum
router.delete("/:userId/:id", async (req, res) => {
    let { userId, id } = req.params;
    console.log('UserId:', userId, 'ForumId:', id);

    try {
        // Find the forum by its ID
        let forum = await Forum.findByPk(id);

        // Check if the forum exists
        if (!forum) {
            res.sendStatus(404);
            return;
        }

        // Delete the forum
        await Forum.destroy({
            where: { id: id }
        });

        // Send a success response
        res.json({
            message: "Forum was deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting forum:", error);
        res.status(500).json({
            error: `An error occurred while deleting the forum with id ${id}`
        });
    }
});

module.exports = router;
