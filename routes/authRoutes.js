const express = require("express");
const router = express.Router();
const {
  register,
  login,
  me,
  listUsers,
  updateRegion,
  updateSourcePermission,
} = require("../controllers/authController");
const { protect, requireGovernment } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.patch("/region", protect, updateRegion);
router.get("/users", protect, requireGovernment, listUsers);
router.patch(
  "/users/:userId/source-permission",
  protect,
  requireGovernment,
  updateSourcePermission
);

module.exports = router;
