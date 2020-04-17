const { db } = require('../utils/admin');
const USERS = 'users'; 

exports.getAllUsers = (req, res) => {
    let users = [];
    db
        .collection(`${USERS}`)
        .get()
        .then(docs => {
            docs.forEach(doc => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
        })
        .then(() => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}