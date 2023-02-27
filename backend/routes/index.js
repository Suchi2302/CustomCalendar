const express = require("express");
const {
  getCalendardata,
  updateCalendarData,
  signup,
  login,
  logout,
} = require("../controllers/user-controller");
var router = express.Router();
router.get("/calendar", getCalendardata);
router.put("/calendar", updateCalendarData);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
module.exports = router;
