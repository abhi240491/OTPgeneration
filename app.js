const express = require("express");
const AWS = require("aws-sdk");

const app = express();

app.use(express.json());
//AWS config
const creds = new AWS.SharedIniFileCredentials({ profile: "default" });
const sns = new AWS.SNS({ creds, region: "ap-south-1" });

const attributes = {
  attributes: {
    MonthlySpendLimit: "5",
    //DeliveryStatusIAMRole: 'arn:aws:iam::814320631450:user/otpAuthUser',
    DefaultSMSType: "Transactional",
  },
};
sns.setSMSAttributes(attributes, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  //else     console.log(data);           // successful response
});


//routes
app.get("/status", (req, res) => res.send({ status: "ok", sns }));

/* 
app.post('/subscribe',(req,res)=>{
    const params = {
        Protocol: 'sms',
        TopicArn: 'arn:aws:sns:us-east-1:814320631450:otpAuth', 
        Endpoint: req.body.contact,
      };
      sns.subscribe(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else 
            res.send(data)     
      });
}) 
*/
app.post("/publish", (req, res) => {
  const params = {
    Subject: "Testing",
    Message: `Thank you for choosing Kamai App your OTP is ${Math.floor(
      Math.random() * 10000
    )}. OTP validity for 10min. Max three attempts allowed.`,
    PhoneNumber: req.body.contact,
    //TopicArn: 'arn:aws:sns:us-east-1:814320631450:otpAuth', /* required for subscribed users*/
  };
  sns.publish(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else res.send(data);
  });
});
//sns.setSMSAttributes;
const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
