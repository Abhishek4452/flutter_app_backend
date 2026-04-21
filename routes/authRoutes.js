const express = require("express");
const router = express.Router();
const {
  register,
  login,
  me,
  updateRegion,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.patch("/region", protect, updateRegion);

module.exports = router;
