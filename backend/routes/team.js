const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT data FROM team WHERE key = 'main'`);
    res.json(result.rows.length ? result.rows[0].data : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const raw = req.body;
    const data = Object.assign({}, raw);
    delete data.$id; delete data.$isNew; delete data.$isDirty;
    await db.query(`INSERT INTO team (key, data) VALUES ('main', $1) ON CONFLICT (key) DO UPDATE SET data = $1`, [JSON.stringify(data)]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
