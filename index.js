const express = require('express');
const server = express();
const cors = require('cors');

const postRoutes = require('./routes/postRoutes.js');

server.use(cors());
server.use('/api/posts', postRoutes);
server.use('/', (req, res) => res.send('API up and running'));

const port = 5000;
server.listen(port, () => console.log(`running on port ${port}`));