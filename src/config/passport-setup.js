import pkg from "passport-google-oauth20";
const { Strategy: GoogleStrategy } = pkg;
import passport from "passport";

passport.use(
  new GoogleStrategy({
    //options for the Google strategy
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
    passReqToCallback: true,
  }),
  () => {
    //passport callback function
  }
);
