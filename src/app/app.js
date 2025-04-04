import express from 'express';
import apiUserRoutes from '../routes/apiUser.routes.js';
import departamentoRoutes from '../routes/departamento.routes.js';

const app = express();
//Middleware
app.use(express.json());
//Prefix for all routes
app.use('/api_v1', apiUserRoutes);
app.use('/api_v1', departamentoRoutes);

app.use((rep, res, nex) => {
  res.status(404).json ({
    message: 'Endpoint losses'
  });
});

export default app;