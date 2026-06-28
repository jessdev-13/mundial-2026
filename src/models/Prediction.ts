import mongoose, { Schema, Document } from "mongoose"

export interface IPrediction extends Document {
  userId: string
  matchId: number
  homeScore: number
  awayScore: number
  createdAt: Date
  updatedAt: Date
}

const PredictionSchema = new Schema<IPrediction>(
  {
    userId: { type: String, required: true },
    matchId: { type: Number, required: true },
    homeScore: { type: Number, required: true, min: 0 },
    awayScore: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
)

PredictionSchema.index({ userId: 1, matchId: 1 }, { unique: true })

export default mongoose.models.Prediction ||
  mongoose.model<IPrediction>("Prediction", PredictionSchema)