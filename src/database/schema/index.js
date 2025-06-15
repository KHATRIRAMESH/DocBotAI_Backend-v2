import * as userSchema from "./user-schema.js";
import * as customerSchema from "./customer-schema.js";

export const schema = {
  ...userSchema,
  ...customerSchema,
};
