const express = require("express");
const { check } = require("express-validator");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const auth = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: The task title
 *         description:
 *           type: string
 *           description: The task description
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The task due date
 */

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  auth,
  [check("title", "Title is required").not().isEmpty()],
  createTask,
);

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", auth, getTasks);

/**
 * @swagger
 * /task/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The task was successfully updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id",
  auth,
  [
    check("title")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Title cannot be empty if provided"),
    check("description").optional(),
    check("status")
      .optional()
      .isIn(["Pending", "InProgress", "Complete"])
      .withMessage("Invalid status"),
    check("dueDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid due date"),
  ],
  updateTask,
);

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: The task was successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", auth, deleteTask);

module.exports = router;
