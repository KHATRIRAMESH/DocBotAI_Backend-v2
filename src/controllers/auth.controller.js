import bcrypt from "bcryptjs";
import { db } from "../database/connection/dbConnection.js";
import { users } from "../database/schema/user-schema.js";
import { and, eq } from "drizzle-orm";

export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.provider, "local")))
      .then((res) => res[0]);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const [registeredUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        provider: "local",
      })
      .returning();

    const userWithoutPassword = { ...registeredUser, password: undefined };
    req.login(userWithoutPassword, (err) => {
      if (err) return next(err);
      return res.redirect("/dashboard");
      // .status(200)
      // .json({ registeredUser, message: "User registered successfully" });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

export async function authenticateLocalUser(email, password) {
  console.log("Authenticating user with email:", email);
  //   console.log(db.query);
  const result = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.provider, "local")))
    .limit(1);
  console.log(result);
  console.log("Result length:", !result.length);
  if (!result.length) {
    return { success: false, message: "User not found" };
  }
  const user = result[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { success: false, message: "Invalid password" };
  }
  return { success: true, user };
}
