const express = require("express");
const router = express.Router();
const passport = require("passport");
const { authController } = require("../controllers");
router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    const token= req.user.getJwtToken();
    res.redirect("/");
  }
);

module.exports = router;
