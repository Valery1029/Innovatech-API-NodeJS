import express from 'express';

const app = express();
const PORT = 3000;
const apiName = '/api/v1';

app.get(apiName, (req, res) => res.send('GET data API'));//GET
app.get(apiName + '/:id', (req, res) => res.send('GET data API FOR ID'));//GET ID
app.post(apiName, (req, res) => res.send('POST data API'));//POST
app.put(apiName + '/:id', (req, res) => res.send('PUT data API FOR ID'));//PUT
app.delete(apiName + '/:id', (req, res) => res.send('DELETE data API FOR ID' + req.params.id));//DELETE ID

app.listen(PORT, () => console.log('Server running... on port' + PORT));