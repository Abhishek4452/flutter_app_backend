const express = require("express");
const router = express.Router();
const {
  addSource,
  getSources,
} = require("../controllers/waterSourceController");

router.post("/add", addSource);
router.get("/", getSources);

module.exports = router;