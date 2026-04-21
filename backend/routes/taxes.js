const { Router } = require('express');
const db = require('../db');

function clean(obj) {
  const o = Object.assign({}, obj);
  delete o.$id; delete o.$isNew; delete o.$isDirty;
  return o;
}

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT data FROM taxes');
    res.json(result.rows.map(r => r.data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT data FROM taxes WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0].data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = clean(req.body);
    await db.query('INSERT INTO taxes (id, data) VALUES ($1, $2)', [data.id, JSON.stringify(data)]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const data = clean(req.body);
    await db.query('UPDATE taxes SET data = $1 WHERE id = $2', [JSON.stringify(data), req.params.id]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM taxes WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /taxes — replaces all taxes (used by setTaxes)
router.put('/', async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM taxes');
    for (const tax of req.body) {
      const t = clean(tax);
      await client.query('INSERT INTO taxes (id, data) VALUES ($1, $2)', [t.id, JSON.stringify(t)]);
    }
    await client.query('COMMIT');
    res.json(req.body);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
