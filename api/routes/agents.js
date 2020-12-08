const { request } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
        //cb(null, new Date().toISOString() + file.originalfilename);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else{
        cb(null, false);  
    }   
};

const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1025 * 30
    },
    fileFilter: fileFilter
});

const Agent = require('../models/agent');

//Handle incoming GET requests to /agents 

  //Agent.find()
    //.then(agents => res.status(200).json(agents))
    //.catch(ex => console.log(ex));
router.get('/', (req, res, next) => {
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
});

router.post('/', upload.single('agentImage'), (req, res, next) => {
    console.log(req.file);
    const agent = new Agent({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        income: req.body.income,
        agentImage: req.file.path
    });

  //       agent.save()
  //      .then(result => res.status(200).json(result))
  //      .catch(err => console.log(err));
    
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
});

router.get('/:agentId', (req, res, next) => {
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
});

router.patch('/:agentId', (req, res, next) => {
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
});

router.delete('/:agentId', (req, res, next) => {
    const id = req.params.agentId
    Agent.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Agent Deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/agents' ,
                body: { name: 'String', income: 'Number' }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;