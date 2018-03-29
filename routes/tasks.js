let express = require('express');
let router = express.Router();

router.get('/tasks', function(req, res, next){
    res.send('tasks.html');
});

module.exports = router;