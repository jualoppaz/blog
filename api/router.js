const express = require('express');

const router = express.Router();

// API REST routes
require('./routes')(router);

router.get('/*', (req, res) => {
  res.status(404).send('not-found');
});

module.exports = router;
