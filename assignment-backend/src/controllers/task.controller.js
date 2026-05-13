const Task = require('../models/task.model');
const Project = require('../models/project.model');

exports.createTask = async (req, res, next) => {
    try {
        const { title, status, projectId } = req.body;
        if (!title || !projectId) {
            return res.status(400).json({ message: 'Title and projectId are required' });
        }
        const project = await Project.findById(projectId);
        if (!project || project.userId.toString() !== req.user) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }
        const task = await Task.create({
            title,
            status: status || 'Todo',
            projectId,
            userId: req.user 
        });
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

exports.getTasksByProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project || project.userId.toString() !== req.user) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }
        const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }
        task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized to delete this task' });
        }
        await task.deleteOne();
        res.status(200).json({ message: 'Task removed successfully' });
    } catch (error) {
        next(error);
    }
};