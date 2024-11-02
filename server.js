require('dotenv').config();
const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

webPush.setVapidDetails(
  'mailto:shebinjosejacob@gmail.com',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

// Endpoint to receive subscription object
app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  // Send a 201 status - Resource created
  res.status(201).json({});

  // Payload to be sent with the push notification
  const payload = JSON.stringify({
    title: 'Hello!',
    body: 'You have a new notification!'
  });

  // Send the push notification
  webPush.sendNotification(subscription, payload).catch(error => console.error(error));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
