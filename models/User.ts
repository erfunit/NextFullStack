import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const User = models.User || model("User", userSchema);

export default User;
