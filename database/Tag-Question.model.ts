import { model, Schema, Document, models } from "mongoose";

export interface ItagQuestions {
  tag: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
}

export interface ItagQuestionsDoc extends ItagQuestions, Document {}

const tagQuestionsSchema = new Schema(
  {
    tag: {
      type: Schema.Types.ObjectId,
      ref: "Tags",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true }
);

tagQuestionsSchema.index({ tag: 1, question: 1 }, { unique: true });

const TagQuestions =
  models.TagQuestions ||
  model<ItagQuestions>("TagQuestions", tagQuestionsSchema);

export default TagQuestions;
