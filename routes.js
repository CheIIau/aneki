const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  console.log('get to chat');
  res.send({ some: 'json' });
});

module.exports = router;
