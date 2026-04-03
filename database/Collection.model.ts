import { model, Schema, Document, models } from "mongoose";

export interface Icollection {
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
}

export interface IcollectionDoc extends Icollection, Document {}

const collectionSchema = new Schema(
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
  },
  { timestamps: true }
);

// Prevent duplicate collections for the same user and question
collectionSchema.index({ author: 1, question: 1 }, { unique: true });

const Collection =
  models.Collection || model<Icollection>("Collection", collectionSchema);

export default Collection;
