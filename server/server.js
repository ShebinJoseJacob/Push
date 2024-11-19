const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Generate VAPID keys using `web-push generate-vapid-keys`
const vapidKeys = {
    publicKey: 'BAVqYcw91jG8w7OL3x4VgSf0b_GAxY4kSG53IxBRT-MvYQ2M3DO1Wu_mlCQw2vnFUrHqicpf5sVzbN1Pf0IMWUU',
    privateKey: '7wIz0BSYpAhlKB-j4eu6DvdGTYoyxw-qH0wQeFqwkFM',
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
    const notificationPayload = JSON.stringify({ title: 'New Notification', body: 'You have a new message!' });

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
