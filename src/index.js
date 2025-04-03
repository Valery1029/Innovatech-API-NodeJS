import express from 'express';
import { connect } from '../db/connect.js';
import departamentoRoutes from './routes/departamento.routes.js';

const app = express();
const PORT = 3000;

app.get('/api_v1/ping', async (req, res) => {
  const result = await connect.query('SHOW TABLES');
  res.json(result[0]);
});

app.use(departamentoRoutes);

app.listen(PORT, () => console.log('Server running... on port' + PORT));