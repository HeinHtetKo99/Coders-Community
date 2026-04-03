import { model, Schema, Document, models } from "mongoose";

export interface Ianswer {
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  content: string;
  upvotes: number;
  downvotes: number;
}

export interface IanswerDoc extends Ianswer, Document {}

const answerSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

answerSchema.index({ question: 1, createdAt: -1 });
answerSchema.index({ question: 1, upvotes: -1 });
answerSchema.index({ author: 1, createdAt: -1 });

const Answer = models.Answer || model<Ianswer>("Answer", answerSchema);

export default Answer;
