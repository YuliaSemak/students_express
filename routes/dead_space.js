var express = require('express');
var router = express.Router();
const db = require('../db/connector');

router.get('/', async function(req, res, next) {
  const weapon = await db.query('SELECT * FROM users_test');

  const modWeapons = weapon.rows.map(w => {
    return {
      ...w,
      created_at: w.created_at.toLocaleDateString()
    }
  })
  res.render('dead_space', { weapons: modWeapons || [] });
});

module.exports = router;
