require('dotenv').config;

const express = require('express');
const mongoose = require('mongoose');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const jwt = require('jsonwebtoken');




const app = express();
const PORT = 5000 || process.env.PORT;



app.use(express.static('public'));

app.use(express.urlencoded({ extended: true } ));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));
  

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));



app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`);
})

mongoose.connect("mongodb+srv://Salma:72LOZ2MzOPMp3Dr2@backenddb.8nfa5vw.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB")
.then(() => {
    console.log("connected to database!");
})
.catch(() => {
    console.log("connection failed");
});