import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Box } from "@mui/material";

import "swiper/css";

import { Narrator } from "./style";
import WordNarrator from "./WordNarrator";

import { Seconds, ITranscript } from "@/types";
interface Props {
  onSeek: (time: Seconds) => void;
  transcript?: ITranscript[]; //update type later
}

const PAUSE_DURATION_BEFORE_RESUMING_AUTOSCROLL = 5000;
const ONE_SECOND = 1000;
const SentenceNarrator = forwardRef(function SynthesizeRef(
  { onSeek, transcript = [] }: Props,
  ref
) {
  const narratorWrapper = useRef<HTMLDivElement>(null);
  const sentenceRef = useRef<(any | null)[]>([]);
  const [autoScrolling, setAutoScrolling] = useState(true);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollPositionPrePause, setScrollPositionPrePause] = useState(0);

  const handleScroll = () => {
    setAutoScrolling(false);
    const scrollTop = Number(narratorWrapper.current?.scrollTop);
    if (scrollTop !== scrollPosition) {
      setScrollPosition(scrollTop);
      setTimeout(() => {
        setScrollPositionPrePause(scrollTop);
      }, PAUSE_DURATION_BEFORE_RESUMING_AUTOSCROLL);
    }
  }

  useEffect(() => {
    if (scrollPosition===scrollPositionPrePause ) {
      setAutoScrolling(true);
    }
  }, [scrollPosition, scrollPositionPrePause]);
  
  const getActiveIndex = (currentTime: Seconds) => {
    return transcript.findIndex((sentence) => {
      if (currentTime < 0.5) return 0;
      const startAt = sentence.audioOffset;
      const duration = sentence.duration;

      return (
        startAt < currentTime * ONE_SECOND && currentTime * ONE_SECOND < startAt + duration
      );
    });
  };

  useImperativeHandle(ref, () => ({
    setCurrentTime: (currentTime: Seconds) => {
      const index = getActiveIndex(currentTime);
      const remoteIndex = index === -1 ? 0 : index;

      const sentenceEle = narratorWrapper?.current?.childNodes[
        remoteIndex
      ] as HTMLElement;

      sentenceEle?.classList?.add("active-sentence");
      narratorWrapper?.current?.childNodes.forEach((item, index) => {
        if (index !== remoteIndex) {
          (item as HTMLElement)?.classList?.remove("active-sentence");
        }
      });
      if (sentenceRef.current[index]?.setTime) {
        sentenceRef.current[index].setTime(currentTime);
      }

      if (
        autoScrolling &&
        sentenceEle &&
        narratorWrapper &&
        narratorWrapper.current
      ) {
        narratorWrapper.current.scrollTop = sentenceEle.offsetTop - 12; // 12px of top padding
      }
    },

    resetNarrator: () => {
      narratorWrapper?.current?.childNodes.forEach((item, index) => {
        (item as HTMLElement)?.classList?.remove("active-sentence");
      });
      sentenceRef.current.forEach((item) => {
        if (item?.resetNarrator) {
          item.resetNarrator();
        }
      });
    },
  }));

  const handleSeekToSentence = (audioOffset: number, index: number) => {
    narratorWrapper?.current?.childNodes.forEach((item) => {
      (item as HTMLElement)?.classList?.remove("active-sentence");
    });

    const sentenceEle = narratorWrapper?.current?.childNodes[
      index
    ] as HTMLElement;
    sentenceEle?.classList?.add("active-sentence");
    const audioOffsetNumber = audioOffset;
    onSeek(Math.max(audioOffsetNumber - 400, 0) as Seconds);
    sentenceRef.current.forEach((item) => {
      if (item?.resetNarrator) {
        item.resetNarrator();
      }
    });
  };

  return (
    <>
      {transcript && (
        <Narrator ref={narratorWrapper} onScroll={handleScroll}>
          {transcript?.map((sentence, index) => {
            return (
              <Box
                key={index}
                mb={2}
                sx={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleSeekToSentence(sentence.audioOffset, index)
                }
              >
                <WordNarrator
                  words={sentence.words}
                  startAt={sentence.audioOffset}
                  duration={sentence.duration}
                  ref={(ref: any) => (sentenceRef.current[index] = ref)}
                />
              </Box>
            );
          })}
        </Narrator>
      )}
    </>
  );
});

export default SentenceNarrator;
