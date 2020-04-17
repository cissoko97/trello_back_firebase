const { db, firebase } = require("../utils/admin");
const USERS = 'users'
const { config } = require('../utils/config');
const utils = require('../utils/utils.functions');

//const firebase = require('firebase')
//firebase.initializeApp(config)


exports.signup = (req, res) => {
    var uid = null;
    var token = null;
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmedPassword: req.body.confirmedPassword,
        phone: req.body.phone
    }

    let errors = {};

    if (utils.Tools.isEmpty(newUser.email)) {
        errors.email = 'Must not be empty';
    } else if (!utils.Tools.isEmail(newUser.email)) {
        errors.email = 'Must be a valid Email adress';
    }

    if (utils.Tools.isEmpty(newUser.name)) {
        errors.name = 'Must not be empty'
    }

    if (utils.Tools.isEmpty(newUser.password)) {
        errors.password = 'Must not be empty'
    }
    if (newUser.confirmedPassword !== newUser.password) {
        errors.confirmedPassword = 'Must not be empty'
    }
    // TODO :: Validate Data
    if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
    }

    db.doc(`/${USERS}/${newUser.email}`)
        .get()
        .then(doc => {
            if (doc.exists)
                res.status(400).json({ email: "email is already used" })
            else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        }).then(data => {
            uid = data.user.uid;
            return data.user.getIdToken()
        }).then(mytoken => {
            delete newUser.confirmedPassword;
            token = mytoken;
            // res.status(201).json({ token })
            const credentialsUser = {
                ...newUser,
                userID: uid,
                createdAt: new Date().toISOString()
            }
            return db.doc(`/${USERS}/${newUser.email}`).set(credentialsUser)
        }).then(() =>
            res.status(201).json({ token, uid })
        ).catch(err => {
            res.status(500).json(err)
        })
}

exports.login = (req, res) => {
    let uid = null;
    let errors = {};
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    if (utils.Tools.isEmpty(user.email)) {
        errors.email = 'Must not be Empty'
    }
    if (utils.Tools.isEmail(user.password)) {
        errors.password = 'Must not be Empty'
    }

    if (Object.keys(errors).length > 0) {
        res.status(400).json(errors)
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            uid = data.user.uid
            return data.user.getIdToken()
        }).then(token => {
            res.status(200).json({ token, uid })
        })
        .catch(err => {
            if (err.code === 'auth/wrong-password') {
                res.status(403).json({ general: 'Wrong paramater Forbidden access' })
            }
            res.status(500).json({ err })
        })
}