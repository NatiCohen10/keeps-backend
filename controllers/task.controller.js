const Task = require("../models/tasks.model");
const User = require("../models/users.model");

async function getTasks(req, res) {
  const { userId } = req;

  try {
    const tasks = await Task.find({ user: userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.log("task.controller, getTasks, error", error);
    res.status(500).json({ error: error.message });
  }
}

async function getTaskById(req, res) {
  const { userId } = req;
  const { taskId } = req.params;
  try {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      res.status(401).json({ error: "Unauthorized to access this task" });
    }
    res.status(200).json(task);
  } catch (error) {
    if (error.name === "CastError") {
      console.log(
        `task.controller, getTaskById. Task not found with id: ${taskId}`
      );
      return res.status(404).json({ message: "task not found" });
    }
    console.log(
      "task.controller, getTaskById, error getting task with id",
      taskId,
      error
    );
    res.status(500).json({ message: error.message });
  }
}

async function deleteTask(req, res) {
  const { userId } = req;
  const { taskId } = req.params;
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
    });
    if (!deletedTask) {
      return res
        .status(401)
        .json({ message: "Unauthorized to access this task" });
    }
    await User.findByIdAndUpdate(userId, {
      $pull: { tasks: taskId },
    });
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.log(
      "task.controller, deleteTask, error deleting task with id",
      taskId
    );
    res.status(500).json({ message: error.message });
  }
}

async function createTask(req, res) {
  const { userId } = req;
  const taskBody = req.body;
  try {
    const taskToAdd = { ...taskBody, user: userId };
    const newTask = new Task(taskToAdd);
    const savedTask = await newTask.save();
    await User.findByIdAndUpdate(userId, {
      $push: { tasks: savedTask._id },
    });
    res.status(201).json(savedTask);
  } catch (error) {
    console.log(
      "task.controller, createTask, error while creating a new task",
      error
    );

    if (error.name === "ValidationError") {
      console.log("task.controller, createTask", error.message);
      res.status(400).json({ message: error.message });
    } else {
      console.log("task.controller, createTask", error.message);
      res.status(500).json({ message: "Server error while creating task" });
    }
  }
}

async function updateTask(req, res) {
  const { taskId } = req.params;
  const { userId } = req;
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res
        .status(401)
        .json({ error: "Unauthorized, cannot update this task" });
    }
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.log(
      "task.controller, updateTask, error while updating task",
      error.message
    );
    if (error.name === "ValidationError") {
      console.log("task.controller, updateTask", error.message);
      return res.status(400).json({ message: error.message });
    } else {
      console.log("task.controller, updateController", error.message);
      return res
        .status(500)
        .json({ message: "Server error while updating task" });
    }
  }
}

module.exports = { getTasks, getTaskById, deleteTask, createTask, updateTask };
