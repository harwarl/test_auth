import express from 'express';
import bodyParser from 'body-parser';
import { config } from './src/utils/config.js';
import { connectDb } from './src/repository/DB.js';
import { bootStrap } from './src/routes/index.js';
import cors from 'cors';

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors({
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'OPTIONS', 'DELETE'],
    credentials: true,
    origin: '*'
}))

app.use((req, res, next)=>{
    res.setHeader('Allow-Control-Access-Origin', '*');
    res.setHeader('Allow-Control-Access-Methods', 'GET, POST, OPTIONS, DELETE, PATCH, PUT');
    res.setHeader('Allow-Control-Access-Credentials', true);
    res.setHeader('Allow-Control-Access-Headers', 'Authorization, Content-Type');
    next();
})

app.get('/ping', (req, res, next)=>{
    res.send('pong');
})

app.listen(config.PORT, ()=>{
    console.log(`App is running on port ${config.PORT}`)
    //connect to Db
    connectDb();
    //connect to the routes
    bootStrap(app);
})