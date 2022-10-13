const express = require('express');
const AWS = require('aws-sdk');
const { request } = require('http');

const app = express();

app.use(express.json());
//AWS config
//credentials are automatically fetched as aws is configured on local system(works)
//creds from a json file need to be explored. 
const creds = new AWS.SharedIniFileCredentials({profile:'default'}); 
const sns = new AWS.SNS({creds, region:'us-east-1'})

//routes
app.get('/status',(req,res)=> res.send({status:'ok',sns}))

/*subscribe multiple contacts to send message to multiple users failed using arn for me.*/
app.post('/subscribe',(req,res)=>{
    const params = {
        Protocol: 'sms',
        TopicArn: 'arn:aws:sns:us-east-1:814320631450:otpAuth', 
        Endpoint: req.body.contact,
      };
      sns.subscribe(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else 
            res.send(data)     // successful response
      });
})
app.post('/publish',(req,res)=>{
    const params = {
        Subject: "Testing",
        Message: `Testing OTP generation using SNS publish ${Math.floor(Math.random() * 100)}`,
        PhoneNumber: '+91-8850959617'
        //TopicArn: 'arn:aws:sns:us-east-1:814320631450:otpAuth', /* required */        
      };
      sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else
            res.send(data)     // successful response
      });
})

const port = 3000;

app.listen(port, ()=>{console.log(`Listening on port ${port}`)})


