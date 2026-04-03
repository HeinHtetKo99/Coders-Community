import { model, Schema, Document, models } from "mongoose";

export interface Iquestion {
  _id: string;
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upvotes: number;
  downvotes: number;
  answers: number;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  saved: boolean;
}

export interface IquestionDoc
  extends Omit<Iquestion, "_id" | "saved">, Document {}

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

questionSchema.index({ createdAt: -1 });
questionSchema.index({ upvotes: -1, createdAt: -1 });
questionSchema.index({ answers: 1, createdAt: -1 });
questionSchema.index({ tags: 1, createdAt: -1 });
questionSchema.index({ author: 1, createdAt: -1 });

const Question =
  models.Question || model<Iquestion>("Question", questionSchema);

export default Question;
