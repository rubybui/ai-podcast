export type BoundaryType =
  | "SentenceBoundary"
  | "WordBoundary"
  | "PunctuationBoundary";

export interface IBoundary {
  boundaryType: BoundaryType;
  text: string;
  audioOffset: number;
  duration: number;
  textOffset: number;
  wordLength: number;
}
