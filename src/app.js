import "dotenv/config";
import express from "express";
import passport from "./middleware/auth/passport.js";
import session from "express-session";
import bodyParser from "body-parser";

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
