const STATE = 'state';
const { db , database } = require('../utils/admin');

exports.getStateByProject = (req, res) => {
    // res.status(200).json({ code: 'get State by Project' });
    console.log('Params ID Pro', req.params)
    var project = req.params.projectID;
    var states = [];
    db.collection(`${STATE}`)
        .where('projectID', '==', project)
        .orderBy('index', 'asc')
        .get()
        .then(docs => {
            console.log('doc')
            docs.forEach(doc => {
                states.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            return res.status(200).json(states)
        }).catch(err => {
            return res.status(500).json(err)
        })
}

exports.createStateProject = (req, res) => {
    const NewState = {
        label: req.body.label,
        projectID: req.body.projectID,
        index: req.body.index,
        createdAt: req.body.createdAt
    }

    db
        .collection(`${STATE}`)
        .add(NewState)
        .then(doc => {
            return res.status(201).json(doc.id)
        }).catch(err => {
            return res.status(500).json({ err: err.message })
        })
}

exports.deleteState = (req, res) => {
    let id = req.params.stateID;

    database
        .collection(`${STATE}`)
        .doc(id)
        .delete()
        .then(doc => {
            return res.status(204).json('success full delete state')
        }).catch(err => {
            return res.status(500).json(err.message)
        })
}