const express = require('express');

const router = express.Router();

// API REST routes
require('./routes')(router);

router.get('/*', (req, res) => {
  res.status(404).send('not-found');
});

router.get('/google1e2e247e7cbf40b6.html', (req, res) => {
  res.status(200).render('google1e2e247e7cbf40b6');
});

module.exports = router;
