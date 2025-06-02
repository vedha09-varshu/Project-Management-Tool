const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get tasks for a project
router.get('/:projectId', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add task to project
router.post('/', async (req, res) => {
  try {
    const { title, assignedTo, status, projectId } = req.body;
    const task = new Task({ title, assignedTo, status, projectId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Error adding task' });
  }
});

module.exports = router;
