const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTask, deleteTask } = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // Secure all task routes

router.route('/')
    .post(createTask);

router.route('/project/:projectId')
    .get(getTasksByProject);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;