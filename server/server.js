const express = require('express');
require('dotenv').config();

const server = express();

server.get('/', (req, res) => {
    res.send("Work");
    res.end();
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})