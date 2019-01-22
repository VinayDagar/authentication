const fs = require('fs')
const path = require('path')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet  = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

const userRoutes = require('./routes/users')

const app = express();
const port = process.env.PORT || 3000;
const MONGO_URI = 'mongodb://changed:userpass@ds149744.mlab.com:49744/vue_express'

const accessStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags: 'a'})

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessStream}))

app.use((req, res, next) => {
    res.setHeader('Access-control-Allow-Origin', '*');
    res.setHeader('Access-control-Allow-Methods', 'GET, POST, PUT, DELETE ');
    res.setHeader('Access-control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(userRoutes);

app.use((err, req, res, next) =>{
    // const status = err.statusCode || 500;
    if(err.statusCode){
        console.log(err.message)
        return res.status(err.statusCode).json({err: err.message})
    }
    return res.status(500).json({msg:'Some thing went wrong on the server side'})
    // const message = err;
});


mongoose.connect(MONGO_URI, connect => {
    // console.log(connect)
    app.listen(port, () => {
        console.log(`server listining at port ${port}`);
    })
})