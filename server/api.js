const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');


const PORT = 8092;
const app = express();

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.use('/', routes)  

app.options('*', cors());


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);


module.exports = app;