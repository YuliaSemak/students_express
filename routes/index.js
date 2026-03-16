var express = require('express');
var router = express.Router();
const db = require('../db/connector');

router.get('/', async function(req, res, next) {
  const sloniki = await db.query('SELECT * FROM sloniki ORDER BY id');

  res.render('index', { sloniki: sloniki.rows || [] });
});

module.exports = router;
