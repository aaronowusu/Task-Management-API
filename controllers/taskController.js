const Task = require('../models/task');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res,next) => {
  const { title, description, status, dueDate } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newTask = new Task({
        title,
        description,
        status,
        dueDate,
        user: req.user.id,
     
    });
    await newTask.save();

    const populatedTask = await Task.findById(newTask._id).populate(
      'user',
      'name email'
    );

    const response = {
      message: 'Task created successfully!',
      task: {
        taskId: populatedTask._id,
        title: populatedTask.title,
        description: populatedTask.description,
        status: populatedTask.status,
        dueDate: populatedTask.dueDate,
        user: {
          userId: populatedTask.user._id,
          name: populatedTask.user.name,
          email: populatedTask.user.email,
        },
      },
    };

    return res.status(201).json(response);
  } catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  }
};

exports.getTasks = async (req, res,next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(tasks);
  } catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  }
};

exports.updateTask = async (req, res,next) => {
  const { title, description, status, dueDate } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Build the update object
    const updateFields = {};
    if (title && title !== task.title) updateFields.title = title;
    if (description && description !== task.description)
      updateFields.description = description;
    if (status && status !== task.status) updateFields.status = status;
    if (
      dueDate &&
      new Date(dueDate).getTime() !== new Date(task.dueDate).getTime()
    )
      updateFields.dueDate = dueDate;

    // Check if there are any changes
    if (Object.keys(updateFields).length === 0) {
      return res.status(200).json({ message: 'Nothing was updated' });
    }

    // Update the task with the changed fields
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateFields },
      { new: true, runValidators: true, context: 'query' }
    ).populate('user', 'name email');

    return res.status(200).json({
      message: 'Task updated successfully!',
      task: {
        taskId: updatedTask._id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        dueDate: updatedTask.dueDate,
        user: {
          userId: updatedTask.user._id,
          name: updatedTask.user.name,
          email: updatedTask.user.email,
        },
      },
    });
  } catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  }
};

exports.deleteTask = async (req, res,next) => {
  try {
    
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Task successfully removed!' });
  } catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  }
};
