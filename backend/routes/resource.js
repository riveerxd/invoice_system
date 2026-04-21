const { Router } = require('express');
const db = require('../db');

function clean(obj) {
  const o = Object.assign({}, obj);
  delete o.$id;
  delete o.$isNew;
  delete o.$isDirty;
  return o;
}

module.exports = function createResourceRouter(table) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const result = await db.query(`SELECT data FROM ${table}`);
      res.json(result.rows.map(r => r.data));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const result = await db.query(`SELECT data FROM ${table} WHERE id = $1`, [req.params.id]);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0].data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const data = clean(req.body);
      await db.query(`INSERT INTO ${table} (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2`, [data.id, JSON.stringify(data)]);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.patch('/:id', async (req, res) => {
    try {
      const data = clean(req.body);
      await db.query(`UPDATE ${table} SET data = $1 WHERE id = $2`, [JSON.stringify(data), req.params.id]);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await db.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
