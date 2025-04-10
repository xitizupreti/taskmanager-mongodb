const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");
const { validateTask, validateStatus } = require("../middleware/validation");
const auth = require("../middleware/authMiddleware");

// Apply auth middleware to all task routes
router.use(auth);

router.route("/").get(getTasks).post(validateTask, createTask);

router
  .route("/:id")
  .get(getTask)
  .put(validateTask, updateTask)
  .delete(deleteTask);

// Bonus endpoint for updating only the status
router.patch("/:id/status", validateStatus, updateTaskStatus);

module.exports = router;
