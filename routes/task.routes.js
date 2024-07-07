const express = require("express");
const {
  getTasks,
  getTaskById,
  deleteTask,
  createTask,
  updateTask,
} = require("../controllers/task.controller");
const router = express.Router();

router.get("/", getTasks);
router.get("/:taskId", getTaskById);
router.delete("/:taskId", deleteTask);
router.post("/", createTask);
router.patch("/:taskId", updateTask);

module.exports = router;
