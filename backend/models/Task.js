const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Task', taskSchema);
