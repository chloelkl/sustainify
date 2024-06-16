const express = require('express');
const router = express.Router();
const { Test } = require('../models'); // Call name of DB from models folder to use
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body -> Update Details of request body to match fields define in DB
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500)
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Test.create(data); // .create() used to insert data into DB table
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
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } } // Adjust to match DB fields
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;
    
    let list = await Test.findAll({
        where: condition,
        order: [['createdAt', 'DESC']] // The list of all items in DB, either in DESC or ASC order
    });
    res.json(list);
});

// Find DB data by Id
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let test = await Test.findByPk(id);
    // Check id not found
    if (!test) {
        res.sendStatus(404);
        return;
    }
    res.json(test);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let test = await Test.findByPk(id);
    if (!test) {
        res.sendStatus(404);
        return;
    }
    
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500) // Adjust to match DB fields
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Test.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Test was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update test with id ${id}.`
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
    let test = await Test.findByPk(id);
    if (!test) {
        res.sendStatus(404);
        return;
    }

    let num = await Test.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Test was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete test with id ${id}.`
        });
    }
});

module.exports = router;