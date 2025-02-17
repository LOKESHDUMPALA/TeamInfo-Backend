const express = require("express");
const { updateProgress, getUsersByTeam, getAverageProgress } = require("../controllers/user-controller");

const router = express.Router();

router.patch("/updateProgress", updateProgress);
router.get("/users/:teamname", getUsersByTeam);
router.get("/average_progress", getAverageProgress);

module.exports = router;
