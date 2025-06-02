const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new project
// POST comment to a project
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, text } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const comment = { author, text };
    project.comments.push(comment);
    await project.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router;