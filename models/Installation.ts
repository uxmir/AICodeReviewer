import mongoose, { Schema, Document } from "mongoose";
export interface Install extends Document {
  installationId: number;
  account: string;
  targetType: string;
  repositories: any;
}
const installationSchema = new Schema<Install>(
  {
    installationId: {
      type: Number,
      required: true,
      unique: true,
    },
    account: {
      type: String,
    },
    targetType: {
      type: String,
    },
    repositories: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.models.Installation ||
  mongoose.model<Install>("Installation", installationSchema);
