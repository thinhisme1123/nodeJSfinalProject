// file index tổng của app
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const Handlebars = require('handlebars');
const handlebars = require('express-handlebars').engine;
const methodOverride = require('method-override')
const app = express();
const port = 3000;

const route = require('./routes/index');
const db = require('./config/db');


// connect to db
db.connect()

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'))

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// http logger
app.get(morgan('combined'));

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

//routes
route(app);






//listen the port
app.listen(port, () => {
    console.log(`Example app listening on port https://localhost:${port}`);
});