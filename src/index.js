import express from 'express';
import departamentoRoutes from './routes/departamento.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api_v1', departamentoRoutes);

app.listen(PORT, () => console.log('Server running... on port' + PORT));