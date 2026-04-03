import { model, Schema, Document, models } from "mongoose";

export interface Ivote {
  author: Schema.Types.ObjectId;
  type_id: Schema.Types.ObjectId;
  type: "question" | "answer";
  voteType: "upvote" | "downvote";
}

export interface IvoteDoc extends Ivote, Document {}

const voteSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["question", "answer"],
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  { timestamps: true }
);

voteSchema.index({ author: 1, type_id: 1, type: 1 }, { unique: true });
voteSchema.index({ author: 1, type: 1, type_id: 1 });
voteSchema.index({ type: 1, type_id: 1 });

const Vote = models.Vote || model<Ivote>("Vote", voteSchema);

export default Vote;
