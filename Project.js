const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' }
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  deadline: Date,
  status: { type: String, enum: ['In Progress', 'Completed', 'On Hold'], default: 'In Progress' },
  tasks: [TaskSchema],
  comments: [CommentSchema] // 👈 New field
});

module.exports = mongoose.model('Project', ProjectSchema);
