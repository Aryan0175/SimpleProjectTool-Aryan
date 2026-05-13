const Project = require('../models/project.model');

exports.createProject = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Project name is required' });
        }
        const project = await Project.create({
            name,
            description,
            userId: req.user 
        });

        res.status(201).json(project);
    } catch (error) {
        next(error); 
    }
};
exports.getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ userId: req.user }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized to update this project' });
        }
        project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized to delete this project' });
        }

        await project.deleteOne();
        res.status(200).json({ message: 'Project removed successfully' });
    } catch (error) {
        next(error);
    }
};