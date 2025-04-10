// controllers/taskController.js
const Task = require("../models/Task");

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    // Add user ID to task
    req.body.user = req.user.id;

    // Ensure description is at least an empty string
    if (!req.body.description) {
      req.body.description = "";
    }

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
// @desc    Get all tasks with pagination, sorting, and filtering
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filtering - only show tasks for logged in user
    const filter = { user: req.user.id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Search by title or description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Sorting
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      // Default sort by createdAt in descending order
      sort.createdAt = -1;
    }

    // Execute query
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(startIndex)
      .limit(limit);

    // Get total count for pagination info
    const total = await Task.countDocuments(filter);

    // Return tasks in the format expected by the frontend
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Other controller methods remain the same but add user check
// For example:

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
