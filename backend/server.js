require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const auth = require('./middleware/auth');
const createResourceRouter = require('./routes/resource');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));

app.use(auth);

app.use('/api/invoices',     createResourceRouter('invoices'));
app.use('/api/clients',      createResourceRouter('clients'));
app.use('/api/bank_accounts', createResourceRouter('bank_accounts'));
app.use('/api/team',         require('./routes/team'));
app.use('/api/taxes',        require('./routes/taxes'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;

db.init().then(() => {
  app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}).catch(err => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});
