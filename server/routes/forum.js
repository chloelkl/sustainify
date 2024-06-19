const express = require('express');
const router = express.Router();
const { Forum } = require('../models'); // Call name of DB from models folder to use
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body -> Update Details of request body to match fields define in DB
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50).required(),
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Forum.create(data); // .create() used to insert data into DB table
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    // Get function to enable data search
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } } // Adjust to match DB fields
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;
    
    let list = await Forum.findAll({
        where: condition,
        order: [['createdAt', 'DESC']] // The list of all items in DB, either in DESC or ASC order
    });
    res.json(list);
});

// Find DB data by Id
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

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let forum = await Forum.findByPk(id);
    if (!forum) {
        res.sendStatus(404);
        return;
    }
    
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50),
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500) // Adjust to match DB fields
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Forum.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Forum was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update Forum with id ${id}.`
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
    let forum = await Forum.findByPk(id);
    if (!forum) {
        res.sendStatus(404);
        return;
    }

    let num = await Forum.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Forum was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Forum with id ${id}.`
        });
    }
});

module.exports = router;