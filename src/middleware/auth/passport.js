import "dotenv/config";
import pkg from "passport-local";
const { Strategy: LocalStrategy } = pkg;
import passportCustom from "passport-custom";
const CustomStrategy = passportCustom.Strategy;
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import { db } from "../../database/connection/dbConnection.js";
import { users } from "../../database/schema/user-schema.js";
import { customers } from "../../database/schema/customer-schema.js";
import { magicLinks } from "../../database/schema/magiclink-schema.js";
import { eq } from "drizzle-orm";
import { authenticateLocalUser } from "../../controllers/auth.controller.js";

// Local Strategy for email and password authentication
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      console.log("Local authentication attempt for email:", email);
      try {
        const result = await authenticateLocalUser(email, password);
        console.log("Authentication result:", result);

        if (!result.success) {
          return done(null, false, { message: result.message });
        }

        return done(null, result.user);
      } catch (error) {
        return done(
          error.message || "An error occurred during authentication",
          null
        );
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      //options for the Google strategy
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log("Google profile:", profile);
      try {
        const email = profile.emails?.[0].value;
        const providerId = profile.id;
        const name = profile.displayName;

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        console.log("Existing user:", existingUser);
        if (existingUser.length > 0) {
          return done(null, existingUser[0]); // user exists
        }

        const insertedUser = await db
          .insert(users)
          .values({
            email,
            name,
            password: "",
            providerId,
            provider: "google",
          })
          .returning();

        return done(null, insertedUser[0]);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

//Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_REDIRECT_URI,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log("Facebook profile:", profile);
      try {
        const email = profile.emails?.[0].value;

        const providerId = profile.id;
        const displayName = profile.displayName;

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.providerId, providerId));

        console.log("Existing user:", existingUser);
        if (existingUser.length > 0) {
          return done(null, existingUser[0]); // user exists
        }

        const insertedUser = await db
          .insert(users)
          .values({
            email,
            providerId,
            name: displayName,
            password: "",
            provider: "facebook",
          })
          .returning();

        return done(null, insertedUser[0]);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

//sigin in with magic link for customers
passport.use(
  "magic",
  new CustomStrategy(async (req, done) => {
    try {
      const QueryToken = req.query.token;
      const adminId = req.query.admin;
      if (!QueryToken) return done(null, false);

      const [record] = await db
        .select()
        .from(magicLinks)
        .where(eq(magicLinks.token, QueryToken));
      console.log("Magic link record:", record);

      //TODO handle current time check
      if (!record || new Date(Date.now()) > record.expiresAt) {
        return done(null, false, { message: "Expired or invalid token" });
      }

      let [customer] = await db
        .select()
        .from(customers)
        .where(eq(customers.email, record.customerEmail));
      // console.log("customer", customer);

      console.log(record.customerEmail, adminId);
      console.log("existing customer", customer);

      if (!customer) {
        // Create new customer on first login
        const [insertedCustomer] = await db
          .insert(customers)
          .values({
            email: record.customerEmail,
            admin: adminId,
          })
          .returning();

        customer = insertedCustomer;
        console.log("customer inserting into db", customer);
      }

      // Token used — delete it
      await db.delete(magicLinks).where(eq(magicLinks.token, QueryToken));

      return done(null, customer);
    } catch (error) {
      return done(
        error.message || "An error occurred during authentication",
        null
      );
      0;
    }
  })
);

//serializing and deserializing session
passport.serializeUser((user, done) => {
  const type = user.provider !== undefined ? "user" : "customer";
  done(null, { id: user.id, type });
});
passport.deserializeUser(async (obj, done) => {
  try {
    let user = null;

    if (obj.type === "user") {
      const result = await db.select().from(users).where(eq(users.id, obj.id));
      user = result[0];
    } else if (obj.type === "customer") {
      const result = await db
        .select()
        .from(customers)
        .where(eq(customers.id, obj.id));
      user = result[0];
    }

    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
