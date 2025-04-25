const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Create Task
router.post('/:projectId', authenticate, async (req, res) => {
  const { title, description } = req.body;
  const { projectId } = req.params;

  try {
    const task = new Task({ title, description, status: 'To Do' });
    await task.save();

    const project = await Project.findById(projectId);
    project.tasks.push(task);
    await project.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Task
router.put('/:taskId', authenticate, async (req, res) => {
  const { title, description, status } = req.body;
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    if (status === 'Completed') {
      task.completedAt = Date.now();
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Task
router.delete('/:taskId', authenticate, async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
