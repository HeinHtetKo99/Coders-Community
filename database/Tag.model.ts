import { model, Schema, Document, models } from "mongoose";

export interface Itags {
  name: string;
  questions: number;
}

export interface ItagsDoc extends Itags, Document {}

const tagsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    questions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

tagsSchema.index({ questions: -1, createdAt: -1 });
tagsSchema.index({ createdAt: -1 });

const Tags = models.Tags || model<Itags>("Tags", tagsSchema);

export default Tags;
