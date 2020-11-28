const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Agent = require('../models/agent');

//Handle incoming GET requests to /agents
router.get('/', (req, res, next) => {

    Agent.find()
    .then(agents => res.status(200).json(agents))
    .catch(ex => console.log(ex));
});

router.post('/', (req, res, next) => {
    const agent = new Agent({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        income: req.body.income
    });

    agent.save()
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err));
    
});

router.get('/:agentId', (req, res, next) => {
    const id = req.params.agentId;

    Agent.findById(id)
    .then(agent => res.status(200).json(agent))
    .catch(ex => console.log(ex));
});

router.patch('/:agentId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated agent!'
    });
});

router.delete('/:agentId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted  agent!'
    });
});


module.exports = router;