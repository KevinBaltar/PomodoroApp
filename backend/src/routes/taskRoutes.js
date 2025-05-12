//backend/src/routes/taskRoutes.js
const express = require("express");
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

const router = express.Router();

// Todas as rotas abaixo desta linha são protegidas
router.use(authController.protect);

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:taskId")
  .get(taskController.getTaskById)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
