import express from 'express';
import apiUserRoutes from '../routes/apiUser.routes.js';
import tipoDocumentoRoutes from '../routes/tipoDocumento.routes.js';
import ciudadRoutes from '../routes/ciudad.routes.js';
import rolRoutes from '../routes/rol.routes.js';
import estadoUsuarioRoutes from '../routes/estadoUsuario.routes.js';
import usuarioRoutes from '../routes/usuario.routes.js';
import almacenamientoRoutes from '../routes/almacenamiento.routes.js';
import ramRoutes from '../routes/ram.routes.js';
import categoriaRoutes from '../routes/categoria.routes.js';
import colorRoutes from '../routes/color.routes.js';
import estadoPqrsRoutes from '../routes/estadoPqrs.routes.js';
import estadoProductoRoutes from '../routes/estadoProducto.routes.js';
import garantiaRoutes from '../routes/garantia.routes.js';
import marcaRoutes from '../routes/marca.routes.js';
import modelosRoutes from '../routes/modelos.routes.js';
import permisosRoutes from '../routes/permisos.routes.js';
import resolucionRoutes from '../routes/resolucion.routes.js';
import sistemaOperativoRoutes from '../routes/so.routes.js';
import tipoPqrsRoutes from '../routes/tipoPqrs.routes.js';
import modelosRolRoutes from '../routes/modelosRol.routes.js';
import permisosModelosRolRoutes from '../routes/permisosModelosRol.routes.js';
import productosRoutes from '../routes/productos.routes.js';
import ofertasRoutes from '../routes/ofertas.routes.js';
import pqrsRoutes from '../routes/pqrs.routes.js';
import comprasRoutes from '../routes/comprasRoutes.js';
import facturaRoutes from '../routes/facturaRoutes.js';

const app = express();
//Middleware
app.use(express.json());
//Prefix for all routes
app.use('/api_v1', apiUserRoutes);
app.use('/api_v1', tipoDocumentoRoutes);
app.use('/api_v1', ciudadRoutes);
app.use('/api_v1', rolRoutes);
app.use('/api_v1', estadoUsuarioRoutes);
app.use('/api_v1', usuarioRoutes);
app.use('/api_v1', almacenamientoRoutes);
app.use('/api_v1', ramRoutes);
app.use('/api_v1', categoriaRoutes);
app.use('/api_v1', colorRoutes);
app.use('/api_v1', estadoPqrsRoutes);
app.use('/api_v1', estadoProductoRoutes);
app.use('/api_v1', garantiaRoutes);
app.use('/api_v1', marcaRoutes);
app.use('/api_v1', modelosRoutes);
app.use('/api_v1', permisosRoutes);
app.use('/api_v1', resolucionRoutes);
app.use('/api_v1', sistemaOperativoRoutes);
app.use('/api_v1', tipoPqrsRoutes);
app.use('/api_v1', modelosRolRoutes);
app.use('/api_v1', permisosModelosRolRoutes);
app.use('/api_v1', productosRoutes);
app.use('/api_v1', ofertasRoutes);
app.use('/api_v1', pqrsRoutes);
app.use('/api_v1', comprasRoutes);
app.use('/api_v1', facturaRoutes);

app.use((rep, res, nex) => {
  res.status(404).json ({
    message: 'Endpoint losses'
  });
});

export default app;