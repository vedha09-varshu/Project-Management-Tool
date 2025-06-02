const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: String,
  status: { type: String, default: 'Pending' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
});

module.exports = mongoose.model('Task', taskSchema);
