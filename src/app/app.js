import express from 'express';
import apiUserRoutes from '../routes/apiUser.routes.js';
import departamentoRoutes from '../routes/departamento.routes.js';
import tipoDocumentoRoutes from '../routes/tipoDocumento.routes.js';
import ciudadRoutes from '../routes/ciudad.routes.js';
import rolRoutes from '../routes/rol.routes.js';
import estadoUsuarioRoutes from '../routes/estadoUsuario.routes.js';
import usuarioRoutes from '../routes/usuario.routes.js';

const app = express();
//Middleware
app.use(express.json());
//Prefix for all routes
app.use('/api_v1', apiUserRoutes);
app.use('/api_v1', departamentoRoutes);
app.use('/api_v1', tipoDocumentoRoutes);
app.use('/api_v1', ciudadRoutes);
app.use('/api_v1', rolRoutes);
app.use('/api_v1', estadoUsuarioRoutes);
app.use('/api_v1', usuarioRoutes);

app.use((rep, res, nex) => {
  res.status(404).json ({
    message: 'Endpoint losses'
  });
});

export default app;