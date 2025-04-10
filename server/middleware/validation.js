const Joi = require("joi");

// Task validation schema
const taskSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().allow("").optional(), // Changed to allow empty string and be optional
  status: Joi.string().valid("pending", "in-progress", "completed").optional(),
});

// Status update validation schema
const statusSchema = Joi.object({
  status: Joi.string().valid("pending", "in-progress", "completed").required(),
});

// Middleware for validating task creation/update
const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Validation Error",
      message: error.details[0].message,
    });
  }

  // Ensure description is at least an empty string if not provided
  if (req.body.description === undefined) {
    req.body.description = "";
  }

  next();
};

// Middleware for validating status update
const validateStatus = (req, res, next) => {
  const { error } = statusSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Validation Error",
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  validateTask,
  validateStatus,
};
