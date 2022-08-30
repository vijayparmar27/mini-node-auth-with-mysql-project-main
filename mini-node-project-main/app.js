const mysql = require("mysql");
const express=require('express');
const dotenv=require('dotenv');
const path=require('path');
const cookieParser = require('cookie-parser');
const app=express();
const port=8000;

const publicDirectory=path.join(__dirname,'./public');


app.set('view engine','hbs');
app.set('view engine','ejs');

app.use(express.static(publicDirectory));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

dotenv.config({path:'./.env'});


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORLD,
    database: process.env.DATABASE,
});

db.connect((err)=>{
    if(err){
        console.log('error in database not connect');
        console.log(err);
    }
    else{
        console.log('succesfully connected database');
    }
});

app.use('/', require('./routes/pages'));
app.use('/auth',require('./routes/auth'))
app.use('/',require('./routes/CRUD'));

app.listen(port,()=>{
    console.log('complate listen sever');
});