const { admin, db } = require('./admin');
const USERS = 'users';


module.exports = (req, res, next) => {
    let idToken;
    // && req.req.headers.authorization.startsWith('Bearer ')
    if (req.headers.authorization) {
        idToken = req.headers.authorization.split(' ')[1];
    } else {
        return res.status(403).json({ error: 'Unauthoriezd' })
    }

    admin.auth()
        .verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            console.log('Token value');
            return db.collection(`${USERS}`).where(
                'userID', '==', decodedToken.uid
            ).limit(1)
                .get()
        }).then(data => {
            console.log('Data', data.docs[0].data());
            req.user.userID = data.docs[0].data().userID;
            return next();
        }).catch(err => {
            //console.error('Error when verify token');
            res.status(403).json({ err });
        })
}