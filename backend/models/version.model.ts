import { SpeechSynthesisBoundaryType } from "microsoft-cognitiveservices-speech-sdk";
import { model, Schema } from "mongoose";
import { IVersion, IBoundary, ITranscript } from "../interfaces";

const BoundarySchema = new Schema<IBoundary>(
  {
    boundaryType: Object.values(SpeechSynthesisBoundaryType),
    text: String,
    audioOffset: Number,
    duration: Number,
    textOffset: Number,
    wordLength: Number,
  },
  { _id: false }
);

const TranscriptSchema = new Schema<ITranscript>(
  {
    boundaryType: Object.values(SpeechSynthesisBoundaryType),
    text: String,
    audioOffset: Number,
    duration: Number,
    textOffset: Number,
    wordLength: Number,
    words: [BoundarySchema],
  },
  { _id: false }
);

const VersionSchema = new Schema<IVersion>({
  variant: { type: Schema.Types.ObjectId, ref: "Variant" },
  speed: { type: Number, required: true },
  voiceName: { type: String, required: true },
  style: String,
  audioName: { type: String },
  transcript: [TranscriptSchema],
  duration: { type: Number },
  status: {
    type: String,
    enum: ["created", "finished"],
    default: "created",
  },
});

VersionSchema.index({ variant: 1, speed: 1, voiceName: 1 }, { unique: true });
export const VersionModel = model<IVersion>("Version", VersionSchema);
