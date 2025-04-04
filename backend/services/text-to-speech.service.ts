import {
  SpeechSynthesizer,
  SpeechConfig,
  PropertyId,
} from "microsoft-cognitiveservices-speech-sdk";
import { AppConfig } from "../config";
import {
  getCharacterLimit,
  splitContentToParts,
  ticksToMs,
  escapeXml,
} from "../helpers";
import { ITranscript } from "../interfaces";

const speechConfig = SpeechConfig.fromSubscription(
  AppConfig.subscriptionKey,
  AppConfig.serviceRegion
);
// Required for WordBoundary event sentences.
speechConfig.setProperty(
  PropertyId.SpeechServiceResponse_RequestSentenceBoundary,
  "true"
);
export interface IConvertParams {
  content: string;
  voiceName?: string;
  speed?: number;
  style?: string;
}

export const convertTextToSpeech = ({
  content,
  speed = 0.95,
  voiceName = "en-US-JennyNeural",
  style,
}: IConvertParams): Promise<{
  buffer: Buffer;
  transcript: ITranscript[];
  duration: number;
}> => {
  const speechSynthesizer = new SpeechSynthesizer(speechConfig);
  speechSynthesizer.synthesisCompleted = function (s, e) {
    console.log(
      `SynthesisCompleted. AudioData: ${e.result.audioData.byteLength} bytes. AudioDuration: ${e.result.audioDuration}`
    );
  };

  speechSynthesizer.synthesisStarted = function (s, e) {
    console.log("SynthesisStarted.");
  };

  return new Promise((resolve, reject) => {
    let tempWordBoundaries = [];
    let wordBoundaries = [];
    let includeNextPunctuation = false;

    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
            xmlns:mstts="http://www.w3.org/2001/mstts"
            xmlns:emo="http://www.w3.org/2009/10/emotionml" xml:lang="en-US">
        <voice name="${voiceName}">
          ${style ? `<mstts:express-as style="${style}">` : ""}
            <prosody rate="${speed}">${content}</prosody>
          ${style ? `</mstts:express-as>` : ""}
        </voice>
      </speak>
    `;

    speechSynthesizer.wordBoundary = function (_s, e) {
      const wordBoundary = {
        boundaryType: e.boundaryType,
        text: e.text,
        audioOffset: ticksToMs(e.audioOffset),
        duration: ticksToMs(e.duration),
        textOffset: e.textOffset,
        wordLength: e.wordLength,
      };

      // TODO: wordBoundaries should be created using audioOffset or textOffset
      if (wordBoundary.boundaryType === "SentenceBoundary") {
        wordBoundaries.push({
          ...wordBoundary,
          words: tempWordBoundaries,
        });
        tempWordBoundaries = [];
        includeNextPunctuation = true;
      } else if (
        wordBoundary.boundaryType === "PunctuationBoundary" &&
        includeNextPunctuation
      ) {
        wordBoundaries[wordBoundaries.length - 1].words.push(wordBoundary);
        includeNextPunctuation = false;
      } else {
        tempWordBoundaries.push(wordBoundary);
      }
    };

    speechSynthesizer.speakSsmlAsync(
      ssml,
      (result: any) => {
        // TODO: should be removed if audioOffset or textOffset be used to create wordBoundaries
        // Fix: Last word might be missing
        if (tempWordBoundaries.length !== 0) {
          wordBoundaries[wordBoundaries.length - 1].words.push({
            ...tempWordBoundaries[0],
          });
        }

        // Sometimes it will run into error but the service will retry
        // So should not throw error here and move on a.k.a retry
        if (result.audioData || result.privAudioData) {
          resolve({
            buffer: Buffer.from(result.audioData || result.privAudioData),
            transcript: wordBoundaries,
            duration: ticksToMs(
              result.audioDuration || result.privAudioDuration
            ),
          });
        }
      },
      (error) => reject(error)
    );
  });
};

export const convertTextToSpeechMultiPart = async ({
  content,
  speed = 0.95,
  voiceName = "en-US-JennyNeural",
  style,
}: IConvertParams): Promise<{
  buffer: Buffer;
  transcript: ITranscript[];
  duration: number;
}> => {
  const cleanContent = escapeXml(content.replace(/^\s+|\s+$/g, ""));
  const contentArray = splitContentToParts(
    cleanContent,
    getCharacterLimit(speed)
  );
  const ttsResult = await Promise.all(
    contentArray.map((content, index) =>
      convertTextToSpeech({ content, speed, voiceName, style }).then((res) => ({
        ...res,
        index,
      }))
    )
  );
  ttsResult.sort((a, b) => (a.index > b.index ? 1 : -1)); // make sure the ordering is correct

  const headerSize = 44; // size of the wav header
  const totalSize =
    headerSize + ttsResult.reduce((acc, cur) => acc + cur.buffer.length, 0);
  ttsResult[0].buffer.writeUInt32LE(totalSize - headerSize, 40); // rewrite the length header for the first buffer

  // * UPDATE AUDIO OFFSET *
  const audioBuffers = [];
  let transcript = [];
  let audioOffset = 0;
  ttsResult.forEach((item, index) => {
    if (index === 0) {
      audioBuffers.push(item.buffer);
    } else {
      audioBuffers.push(item.buffer.slice(headerSize));
      item.transcript.forEach((sentence) => {
        sentence.audioOffset += audioOffset;
        sentence.words.forEach((word) => (word.audioOffset += audioOffset));
      });
    }
    audioOffset += item.duration;
    transcript = [...transcript, ...item.transcript];
  });

  return Promise.resolve({
    buffer: Buffer.concat(audioBuffers, totalSize - headerSize),
    transcript,
    duration: audioOffset,
  });
};
