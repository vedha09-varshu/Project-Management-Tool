const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Project = require('./models/Project');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/projectdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Add a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, deadline, status } = req.body;
    const project = new Project({ name, description, deadline, status });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Add a task to a project
app.post('/api/projects/:projectId/tasks', async (req, res) => {
  try {
    const { name, status } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = { name, status };
    project.tasks.push(task);
    await project.save();

    res.status(201).json(project.tasks[project.tasks.length - 1]); // Return the added task
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});
// Add comment to a project
app.post('/api/projects/:projectId/comments', async (req, res) => {
  try {
    const { author, text } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const comment = { author, text };
    project.comments.push(comment);
    await project.save();

    res.status(201).json(project.comments[project.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});


app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
