import app from './app/app.js';
import dotenv from 'dotenv';

dotenv.config({path: '../env'});
const PORT = process.env.PORT || 3000;

//Inicializar el server
app.listen(PORT, () => {
  console.log(`Server running... on port ${PORT}`);
});