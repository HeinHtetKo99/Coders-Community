import { model, Schema, Document, models } from "mongoose";

export interface Iinteraction {
  user: Schema.Types.ObjectId;
  action: string;
  actionId: Schema.Types.ObjectId;
  actionType: "question" | "answer";
}

export interface IinteractionDoc extends Iinteraction, Document {}

const interactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    actionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    actionType: {
      type: String,
      enum: ["question", "answer"],
      required: true,
    },
  },
  { timestamps: true }
);

const Interaction =
  models.Interaction || model<Iinteraction>("Interaction", interactionSchema);

export default Interaction;
