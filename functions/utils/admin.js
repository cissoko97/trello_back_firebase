const admin = require('firebase-admin');
const firebase = require('firebase');
const { config } = require('./config')

firebase.initializeApp(config)
let serviceAccount = require('./kola-trello-9925c6d26831.json')

admin.initializeApp({
    Credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kola-trello.firebaseio.com"
});

const db = admin.firestore();
const database = firebase.firestore();

module.exports = { admin, db, database, firebase } 