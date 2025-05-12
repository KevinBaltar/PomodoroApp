//backend/src/routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// Exemplo de uma rota protegida (a ser criada em outro arquivo de rota, ex: userRoutes.js)
// router.get("/me", authController.protect, (req, res) => {
//   res.status(200).json({
//     status: "success",
//     data: {
//       user: req.user
//     }
//   });
// });

module.exports = router;
