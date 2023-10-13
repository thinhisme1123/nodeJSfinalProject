// file index tổng của app
const path = require('path');
const express = require('express');
const Handlebars = require('handlebars');
const handlebars = require('express-handlebars').engine;
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
// Template engine
app.engine(
    'hbs',
    handlebars({
        extname: 'hbs',
        helpers: {
            
        }
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));










//listen the port
app.listen(port, () => {
    console.log(`Example app listening on port https://localhost:${port}`);
});