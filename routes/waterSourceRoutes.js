const express = require("express");
const router = express.Router();
const {
  addSource,
  getSources,
  updateSource,
} = require("../controllers/waterSourceController");
const { protect, requireSourceManager } = require("../middleware/authMiddleware");

router.get("/", getSources);
router.post("/add", protect, requireSourceManager, addSource);
router.patch("/:id", protect, requireSourceManager, updateSource);

module.exports = router;
