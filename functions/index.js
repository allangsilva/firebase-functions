const functions = require('firebase-functions');

const admin = require('firebase-admin');

const settings = {
    timestampsInSnapshots: true,
    timeoutSeconds: 500,
    memory: '2GB',
};

admin.initializeApp();
const db = admin.firestore();
db.settings(settings);



//Define uma function chamada addMessage para receber via GET um texto e salvar no database realtime
exports.addMessage = functions.https.onRequest((req, res) => {
    const original = req.query.text;
    
    return admin.database().ref('/messages').push({original}).then( snapshot => {
        return res.redirect(303, snapshot.ref.toString());
    });
});


//Exemplo de gravação de dados via firestore
exports.addUser = functions.https.onRequest((req, res) => {
    const user = req.query.user;

    let docRef = db.collection('users').doc('news');
    docRef.set({ user }).then(result => {
        res.status(200);
        res.send(result);
    })
})

//Trigger disparada no momento da gravação do texto 
//Neste caso coleta a informação e grava com letras maiusculas
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
        const original = snapshot.val();
        console.log(`Upper case  ${context.params.pushId} ${original}`);
        const uppercase = original.toUpperCase();

        return snapshot.ref.parent.child('uppercase').set(uppercase);
    });
