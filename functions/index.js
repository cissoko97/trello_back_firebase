//Collections name déclaration
const PROJECTS = 'projects';
const USERS = 'users';
const STATE = 'state';
const TASKS = 'tasks';

//Express and Body_parser configutration 
const app = require('express')();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { getAllProjects, createOneProjects, getProjectbyUser } = require("./handlers/projects");
const { signup, login } = require('./handlers/auth');
const { getAllUsers } = require('./handlers/users');
const { createStateProject, getStateByProject, deleteState } = require('./handlers/tasteProject');
const { createTaskState, getTaskByState, updateTaskIndex, updateTask, deteleTask } = require('./handlers/tasks')
const functions = require('firebase-functions');

//Middleware
const FBAuth = require('./utils/FBAuth')

//Projects Routes
app.get(`/${PROJECTS}`, getAllProjects)
app.post(`/${PROJECTS}`, FBAuth, createOneProjects)
app.get(`/${PROJECTS}/user`, FBAuth, getProjectbyUser)
//Users Routes
app.post('/login', login)
app.post('/signup', signup)
app.get(`/${USERS}`, getAllUsers)

//State Project Routes
app.post(`/${STATE}`, FBAuth, createStateProject)
app.get(`/${STATE}/:projectID`, getStateByProject)
app.delete(`/${STATE}/:stateID`, deleteState)

//Task Route
app.post(`/${TASKS}`, FBAuth, createTaskState)
app.get(`/${TASKS}/:stateID`, getTaskByState)
app.put(`/${TASKS}`, updateTaskIndex)
app.put(`/${TASKS}/:taskId`, updateTask)
app.delete(`/${TASKS}/:taskId`, deteleTask)

exports.api = functions.https.onRequest(app);