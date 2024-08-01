const express = require('express');
const router = express.Router();
const multer = require('multer');
const { EventPost } = require('../models'); // Call name of DB from models folder to use
const { Op } = require("sequelize");
const yup = require("yup");
const path = require('path');
const fs = require('fs');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory where you want to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
    }
});

const upload = multer({ storage: storage });

// router.get('/statistics', async (req, res) => {
//     const range = req.query.range || '12 months';
//     // Assuming you have a logic to calculate statistics based on the time range
//     // Here we create dummy data for demonstration purposes

//     const statistics = [
//         { week: 1, count: 5 },
//         { week: 2, count: 3 },
//         { week: 3, count: 8 },
//         // add more weeks as per your logic
//     ];

//     res.json(statistics);
// });

router.post("/", upload.single('image'), async (req, res) => {
    let data = req.body;
    // Validate request body -> Update Details of request body to match fields define in DB
    let validationSchema = yup.object({
        eventname: yup.string().trim().min(3).max(100).required(),
        eventdate: yup.string().trim().matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in the format dd/mm/yyyy").required(),
        eventtime: yup.string().trim().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Time must be in 24-hour format (HH:MM)").required(),
        venue: yup.string().trim().min(3).max(100).required(),
        eventdescription: yup.string().trim().min(3).max(500).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        if (req.file) {
            data.image = req.file.path; // Save the image file path
        }

        let result = await EventPost.create(data); // .create() used to insert data into DB table
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { eventname: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;
    
    let list = await EventPost.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let eventpost = await EventPost.findByPk(id);
    // Check id not found
    if (!eventpost) {
        res.sendStatus(404);
        return;
    }
    res.json(eventpost);
});

router.put("/:id", upload.single('image'), async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let eventpost = await EventPost.findByPk(id);
    if (!eventpost) {
        res.sendStatus(404);
        return;
    }
    
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        eventname: yup.string().trim().min(3).max(100).required(),
        eventdate: yup.string().trim().matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in the format dd/mm/yyyy").required(),
        eventtime: yup.string().trim().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Time must be in 24-hour format (HH:MM)").required(),
        venue: yup.string().trim().min(3).max(100).required(),
        eventdescription: yup.string().trim().min(3).max(500).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        if (req.file) {
            // Delete the old image if it exists
            if (eventpost.image) {
                fs.unlinkSync(eventpost.image);
            }
            data.image = req.file.path; // Save the new image file path
        }

        let num = await EventPost.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Event post was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update event post with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let eventpost = await EventPost.findByPk(id);
    if (!eventpost) {
        res.sendStatus(404);
        return;
    }

    // Delete the image file if it exists
    if (eventpost.image) {
        fs.unlinkSync(eventpost.image);
    }

    let num = await EventPost.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Event post was deleted successfully."
        });
    } else {
        res.status(400).json({
            message: `Cannot delete event post with id ${id}.`
        });
    }
});

module.exports = router;
