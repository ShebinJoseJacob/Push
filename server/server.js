const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Generate VAPID keys using `web-push generate-vapid-keys`
const vapidKeys = {
    publicKey: 'BFtX42XNx31EmwuVegKXPhX6bW8AiVOEACYRmB6Lz1-uAAee7IIF5YXX8e7U4fNzYe6x2GNkP8YYPq9sdyXVu10',
    privateKey: 'U0oflm5ZMaeVnV-4pn5hX3s2sueA1V64TzhesGojwAI',
};

// Configure web-push
webPush.setVapidDetails(
    'mailto:example@yourdomain.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Store subscriptions (use a database in production)
let subscriptions = [];

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

app.post('/notify', (req, res) => {
    // Extract the title and body from the request body
    const { title, body } = req.body;

    // Check if title and body are provided
    if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' });
    }

    // Create the notification payload
    const notificationPayload = JSON.stringify({ title, body });

    // Send notifications to all subscriptions
    const promises = subscriptions.map((subscription) =>
        webPush.sendNotification(subscription, notificationPayload)
    );

    Promise.all(promises)
        .then(() => res.status(200).json({ message: 'Notifications sent' }))
        .catch((error) => {
            console.error('Error sending notification', error);
            res.sendStatus(500);
        });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
