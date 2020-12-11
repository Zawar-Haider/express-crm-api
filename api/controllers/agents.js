const Agent    = require('../models/agent');
const mongoose = require('mongoose');

exports.agents_get_all = (req, res, next) => {
    
    //Agent.find()
    //.then(agents => res.status(200).json(agents))
    //.catch(ex => console.log(ex));
    
    Agent.find()
        .select('name income _id agentImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                agents:  docs.map(doc => {
                    return { 
                        name: doc.name,
                        income: doc.income,
                        agentImage: doc.agentImage,
                        _id: doc._id,
                        request: { 
                            type: 'GET',
                            url: 'http://localhost:3000/agents/' + doc._id   //can be fetched using variable
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err 
            });
        }); 
};

exports.agents_create_agent =  (req, res, next) => {
    //       agent.save()
    //      .then(result => res.status(200).json(result))
    //      .catch(err => console.log(err));

console.log(req.file);
const agent = new Agent({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    income: req.body.income,
    agentImage: req.file.path
});
agent
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created Agent successfully",
            createdAgent: {
                name: result.name,
                income: result.income,
                _id: result._id,
                request: {
                    type: 'GET',
                    url:  'http://localhost:3000/agents/' + result._id
                }

            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
};

exports.agents_get_agent = (req, res, next) => {
    const id = req.params.agentId;

    //Agent.findById(id)
    //.then(agent => res.status(200).json(agent))
    //.catch(ex => console.log(ex));

    Agent.findById(id)
    .select('name income _id agentImage')
    .exec()
    .then(doc => {
        console.log("From Database", doc);
        if(doc) {
            res.status(200).json({
                agent: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost/agents'
                }
            });
        } else {
            res
                .status(404)
                .json({ message: "NO valid entry found for provided ID"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err});
    });
};

exports.agents_update_agent = (req, res, next) => {
    const id = req.params.agentId;
    const updateOps = {};
    for(const ops of req.body){ 
        updateOps[ops.propName] = ops.value; 
    }
    Agent.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result =>{
     
        res.status(200).json({
            message: 'Agent Updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/agents/' + id
            }
        });
    })
    .catch(err => { 
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.agents_delete =  (req, res, next) => {
    const id = req.params.agentId
    Agent.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Agent Deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/agents' 
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};