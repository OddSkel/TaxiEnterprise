var express = require('express');
var router = express.Router();

/* GET gestor home page. */
router.get('/gestor', function(req, res, next) {
  res.rendirect('/gestor');
});

module.exports = router;
