const { request }      = require('express');
const express          = require('express');
const router           = express.Router();
const multer           = require('multer');
const checkAuth        = require('../middleware/check-auth');
const AgentsController = require('../controllers/agents');

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
    fileSize: 1024 * 1025 * 10
    },
    fileFilter: fileFilter
});

router.get('/', AgentsController.agents_get_all);

router.post('/', checkAuth, upload.single('agentImage'), AgentsController.agents_create_agent);

router.get('/:agentId', AgentsController.agents_get_agent);

router.patch('/:agentId', checkAuth, AgentsController.agents_update_agent);

router.delete('/:agentId', checkAuth, AgentsController.agents_delete);

module.exports = router;