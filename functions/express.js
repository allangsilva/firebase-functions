const express = require('express');
const bodyParser = require('body-parser');
const services = require('./services');

const app = express();

app.use(bodyParser.urlencoded({
    extended : true 
}));
app.use(bodyParser.json());

app.post('/messages', (req, res) => {
    services.addMessage(req, res);
});

app.get('/messages', (req, res) => {
    services.getMessages(req, res);
});

app.delete('/messages/:id', (req, res) => {
    console.log(req.params)
    services.deleteMessage(req, res);
});

app.listen(3000, () => `app listen in port 3000`);
