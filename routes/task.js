const express = require('express');
const { check } = require('express-validator');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post(
  '/',
  auth,
  [check('title', 'Title is required').not().isEmpty()],
  createTask
);

router.get('/', auth, getTasks);

router.patch(
    '/:id',
    auth,
    [
        check('title').optional().not().isEmpty().withMessage('Title cannot be empty if provided'),
        check('description').optional(),
        check('status').optional().isIn(['Pending', 'InProgress', 'Complete']).withMessage('Invalid status'),
        check('dueDate').optional().isISO8601().toDate().withMessage('Invalid due date')
    ],
    updateTask
);

router.delete('/:id', auth, deleteTask);

module.exports = router;
