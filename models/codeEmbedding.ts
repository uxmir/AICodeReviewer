import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICodeEmbedding extends Document {
  repoId: string;
  filePath: string;
  chunkIndex: number;
  code: string;
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

const codeEmbeddingSchema = new Schema<ICodeEmbedding>(
  {
    repoId: {
      type: String,
      required: true,
      index: true, 
    },
    filePath: {
      type: String,
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number], 
      required: true,
      select: false, 
    },
  },
  {
    timestamps: true,
  }
);

codeEmbeddingSchema.index({ repoId: 1, filePath: 1, chunkIndex: 1 }, { unique: true });

const CodeEmbedding: Model<ICodeEmbedding> =
  mongoose.models.CodeEmbedding ||
  mongoose.model<ICodeEmbedding>("CodeEmbedding", codeEmbeddingSchema);

export default CodeEmbedding;