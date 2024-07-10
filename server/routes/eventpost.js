const express = require('express');
const router = express.Router();
const { EventPost } = require('../models'); // Call name of DB from models folder to use
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
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
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await EventPost.create(data); // .create() used to insert data into DB table
        res.json(result);
    }
    catch (err) {
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

router.put("/:id", async (req, res) => {
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
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await EventPost.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Event post was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update event post with id ${id}.`
            });
        }
    }
    catch (err) {
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

    let num = await EventPost.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Event post was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete event post with id ${id}.`
        });
    }
});

module.exports = router;