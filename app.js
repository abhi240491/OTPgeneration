const express = require('express');
const AWS = require('aws-sdk');

const app = express();

app.use(express.json());
//AWS config

const creds = new AWS.SharedIniFileCredentials({profile:'default'});
const sns = new AWS.SNS({creds, region:'us-east-1'})

//routes
app.get('/status',(req,res)=> res.send({status:'ok',sns}))

const port = 3000;

app.listen(port, ()=>{console.log(`Listening on port ${port}`)})


