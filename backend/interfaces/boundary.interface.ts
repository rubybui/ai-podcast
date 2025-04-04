import { SpeechSynthesisBoundaryType } from "microsoft-cognitiveservices-speech-sdk";

export interface IBoundary {
  boundaryType: SpeechSynthesisBoundaryType;
  text: string;
  audioOffset: number;
  duration: number;
  textOffset: number;
  wordLength: number;
}
