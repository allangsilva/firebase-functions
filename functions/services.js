const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require("./config.json");
process.env.TZ = 'UTC';

const settings = {
    //timestampsInSnapshots: true,
    timeoutSeconds: 500,
    memory: '2GB',
};

if( process.env.FIRBASE_CONFIG)
    admin.initializeApp();
else
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://functions-example-27ce3.firebaseio.com"
    });

const db = admin.firestore();
db.settings(settings);

//Adiciona uma nova mensagem
exports.addMessage = functions.https.onRequest((req, res) => {

    res.setHeader('Content-Type', 'application/json');
    const original = req.body.text;
    
    return db.collection('messages').doc(`user-${Math.random()}`).set({ texto: original })
        .then(value => {
            res.send(value)
            return 
        })

});

//Lista todas as mensagens
exports.getMessages = functions.https.onRequest((req, res) => {

    res.setHeader('Content-Type', 'application/json');
    
    return db.collection('messages')
        .get()
        .then(messages => {
            res.send(messages.docs.map(m => m.data()));
            return;
        })
        .catch((err) => {
           console.log('Error getting documents', err);
           res.status(500);
           return;
        });
});

//delete
exports.deleteMessage = functions.https.onRequest((req, res) => {
   
    res.setHeader('Content-Type', 'application/json');
    const doc = db.collection('messages').doc(req.params.id);
    return doc.delete()
            .then(value => {
                res.send({ ok: "ok" })
                return
            }).catch(err => {
                console.log(err)
                res.status(500)
            })
});