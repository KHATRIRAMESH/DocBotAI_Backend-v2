import { Router } from "express";
import passport from "../middleware/auth/passport.js";
import { registerUser } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
