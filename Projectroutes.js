const express = require('express');
const Project = require('../models/Project');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Create Project
router.post('/', authenticate, async (req, res) => {
  const { title, description } = req.body;

  try {
    const project = new Project({ title, description, userId: req.user.id });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Projects for User
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).populate('tasks');
    res.json(projects);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
