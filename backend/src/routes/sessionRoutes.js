//backend/src/routes/sessionRoutes.js
const express = require("express");
const sessionController = require("../controllers/sessionController");
const authController = require("../controllers/authController");

const router = express.Router();

// Todas as rotas abaixo desta linha são protegidas
router.use(authController.protect);

router
  .route("/")
  .get(sessionController.getAllSessions)
  .post(sessionController.createSession);

router
  .route("/:sessionId")
  .get(sessionController.getSessionById)
  .patch(sessionController.updateSession);

router.get('/stats', sessionController.getSessionStats);

  // Não há DELETE para sessões por padrão, a menos que seja um requisito específico.

module.exports = router;
