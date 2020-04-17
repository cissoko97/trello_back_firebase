const PROJECTS = 'projects'
const { admin, db } = require('../utils/admin')

exports.getAllProjects = (req, res) => {
    let projets = [];
    db
        .collection(`${PROJECTS}`)
        .get()
        .then(docs => {
            docs.forEach(doc => {
                projets.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
        }).then(() => {
            res.status(200).json(projets)
        }).catch(err => {
            res.status(500).json(err)
        })
}

exports.createOneProjects = (req, res) => {
    console.log(req.user)

    // let membres = ['Boris', 'Cissoko'];
    // let ticket = {
    //     1: ['#61bd4f', ''],
    //     2: ['#f2d600', ''],
    //     3: ['#ff9f1a', ''],
    //     4: ['#eb5a46', ''],
    //     5: ['#c377e0', ''],
    //     6: ['#0079bf', '']
    // }
    console.log('Project User ', req.user);
    var project = {
        name: req.body.name,
        chefProjet: req.user.userID,
        membres: req.body.membres,
        ticket: req.body.ticket,
        createdAt: req.body.createdAt
    }
    db
        .collection(`${PROJECTS}`)
        .add(project)
        .then(doc => {
            res.status(200).json(doc.id);
        }).catch(err => {
            res.status(500).json(err);
        })
}

exports.getProjectbyUser = (req, res) => {
    let projects = [];
    db
        .collection(`${PROJECTS}`)
        .where('chefProjet', "==", req.user.userID)
        .orderBy('createdAt', "asc")
        .get()
        .then(docs => {
            docs.forEach(doc => {
                projects.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            return res.status(200).json(projects)
        }).catch(err => {
            res.status(500).json({ err });
        })
}

exports.deleteProject = (req, res) => {
    let projectId = req.params.projectId
    db
        .collection(`${PROJECTS}`)
        .doc(projectId)
        .delete()
        .then(() => {
            return res.status(204).json('Delete project');
        }).catch(err => {
            res.status(500).json('Error when deleting project');
        })
}