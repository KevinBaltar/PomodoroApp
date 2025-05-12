//backend/src/routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// Todas as rotas abaixo desta linha são protegidas
router.use(authController.protect);

router.get("/me", userController.getMe);
router.patch("/updateMe", userController.updateMe);

router.get("/configurations", userController.getUserConfigurations);
router.patch("/configurations", userController.updateUserConfigurations);

router.get("/statistics", userController.getUserStatistics);

router.post('/push-tokens', userController.addPushToken); // Agora com o método implementado

// Outras rotas específicas de usuário podem ser adicionadas aqui
// Ex: router.delete("/deleteMe", userController.deleteMe); // (Implementar no controller se necessário)

module.exports = router;
