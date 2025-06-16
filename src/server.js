import "dotenv/config";
import express from "express";
import passport from "./middleware/auth/passport.js";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRotes from "./routes/adminRotes.js";
import fileRequestRoutes from "./routes/fileRequest.route.js";
import customerRoutes from "./routes/customer.routes.js";
// import fileRoutes from "./routes/fileRoutes.js";

const PORT = process.env.PORT || 8000;
const app = express();
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));

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
      sameSite: "lax", // Helps prevent CSRF attacks
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
app.use("/api/admin", adminRotes);
// app.use("/api/upload-docs", fileRoutes);

app.use("/api/customer", customerRoutes);

app.use("/api/admin/request", fileRequestRoutes);

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
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/profile`); // Redirect to the client dashboard
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});
