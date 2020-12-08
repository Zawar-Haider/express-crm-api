const express = require('express');
const app = express();
const morgan = require('morgan'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 

const agentRoutes = require('./api/routes/agents');

mongoose.connect(
    'mongodb+srv://admin:' + 
        process.env.MONGO_ATLAS_PW +
        '@node-rust-anm.pv5d2.mongodb.net/AgentManagementDB?retryWrites=true&w=majority', 
        { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
//made uploads folder public in order to make it accessible for browser
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//routes which should handle requests
app.use('/agents', agentRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
}); 

module.exports = app; 
