import "dotenv/config";
import express from "express";
import passport from "./middleware/auth/passport.js";
import session from "express-session";
import bodyParser from "body-parser";

import authRoutes from "./routes/authRoutes.js";
import magicLinkRoutes from "./routes/magicLinkRoutes.js";
// import fileRoutes from "./routes/fileRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true, // Helps prevent XSS attacks
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(
    "Welcome to the Home Page! <a href='/login'>Login</a> or <a href='/register'>Register</a>"
  );
});
//MB auth routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", magicLinkRoutes);
// app.use("/api/upload-docs", fileRoutes);

//for google auth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//for facebook auth
app.get("/auth/facebook", passport.authenticate("facebook"));
app.get(
  "/api/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

app.get("/privacy-policy", (req, res) => {
  res.render("privacy-policy.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/dashboard", (req, res) => {
  console.log("User in dashboard:", req.user);
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.render("dashboard.ejs", { user: req.user });
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/send-magic-link", (req, res) => {
  res.render("send-magic-link.ejs");
});

app.get(
  "/auth/magic/callback",
  passport.authenticate("magic", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});
