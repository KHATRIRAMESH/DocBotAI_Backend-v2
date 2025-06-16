import { Router } from "express";
import passport from "../middleware/auth/passport.js";
import { registerUser } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", async (req, res, next) => {
  console.log("Login attempt:", req.body);
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred during login." });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.logIn(user, async (err) => {
      console.log("Login attempt:", user);
      if (err) {
        return res
          .status(500)
          .json({ message: "An error occurred while logging in." });
      }
      return res.status(200).json({
        message: "Login successful",
        user: { id: user.id, userType: user },
      });
    });
  })(req, res, next);
});
router.get("/logout", async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.json({ message: "Logout successful" });
    });
  });
});

export default router;
