import { model, Schema, Document, models } from "mongoose";
export interface Iuser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}
export interface IuserDoc extends Iuser, Document {}
//Add terms field to user model
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    location: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.index({ createdAt: -1 });
userSchema.index({ reputation: -1, createdAt: -1 });
userSchema.index({ name: 1 });

const User = models.User || model<Iuser>("User", userSchema);

export default User;
