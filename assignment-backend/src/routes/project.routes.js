const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware'); 

router.use(protect);

router.route('/')
    .post(createProject)
    .get(getProjects);

router.route('/:id')
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;