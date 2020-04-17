const { db, database } = require("../utils/admin");
const TASKS = 'tasks';

exports.createTaskState = (req, res) => {
    console.log("create tasks");
    console.log('Body State', req.body)
    var stateID = req.body.stateID;
    // let ticket = {};
    // let checklist = {};
    // let membres = [];
    var task = {
        label: req.body.label,
        ticket: req.body.ticket,
        index: req.body.index,
        checklist: req.body.checklist,
        stateID,
        membres: req.body.membres
    }
    db
        .collection(`${TASKS}`)
        .add(task)
        .then(doc => {
            res.status(201).json(doc.id)
        })
        .catch(err => {
            res.status(500).json({ err })
        })
}

exports.getTaskByState = (req, res) => {
    console.log("fetch by Id tasks");
    console.log('Params ID Pro', req.params);
    var stateID = req.params.stateID;
    var tasks = [];
    database.collection(`${TASKS}`)
        .where('stateID', '==', stateID)
        .orderBy('index', 'asc')
        .get()
        .then(docs => {
            console.log('doc')
            docs.forEach(doc => {
                tasks.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            return res.status(200).json(tasks)
        }).catch(err => {
            return res.status(500).json({ err: err.message })
        })
}

exports.updateTaskIndex = (req, res) => {
    var batch = database.batch();

    let { id, tasks } = req.body;
    console.log("id du state", id);
    console.log("tasks du state", tasks);

    tasks.forEach(value => {
        let task = database.collection(`${TASKS}`).doc(value.id);
        batch.update(task, { stateID: id, index: value.index })
    })
    // let task = db.collection(`${TASKS}`).doc(id)

    // console.log("id de la tache", id);
    batch
        .commit()
        .then(() => {
            return res.status(204).json('Good Update');
        }).catch((err) => {
            return res.status(500).json(err.message);
        })
    // return res.status(204).json({ id })
    //     // .then(() => {
    //     // })
    //     // .catch((err) => { res.status(500).json({ err }) })
    // console.log('body', req.body.data)
    // database.doc(`${TASKS}/${id}`).
    //     update({
    //         stateID: req.body.stateID,
    //         index: req.body.index
    //     })
    //     .then(() => {
    //         return res.status(204).json({ ok: 'Good job!!' })
    //     })
    //     .catch((err) => {
    //         return res.status(500).json({ err: err.message })
    //     })
}

exports.updateTask = (req, res) => {
    let id = req.params.taskId;
    let body = {} = req.body

    console.log("id", id);
    console.log("Body", body);
    database.
        collection(`${TASKS}`)
        .doc(id)
        .update({ ...body })
        .then(() => {
            return res.status(204).json('Ok good update');
        }).catch((err) => {
            return res.status(500).json(err.message);
        })
}

exports.deteleTask = (req, res) => {
    let id = req.params.taskId;
    database
        .collection(`${TASKS}`)
        .doc(id)
        .delete().then(err => {
            res.status(204).json('tasks delete')
        }).catch(err => {
            res.status(400).json(err.message)
        });
}