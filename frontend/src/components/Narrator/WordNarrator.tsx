import { Box, Typography } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { Seconds } from "@/types";
import { converseTimeToNumber } from "@/utils";
import { IBoundary } from "@/types";

interface Props {
  words: IBoundary[];
  startAt: number;
  duration: number;
}

const WordNarrator = forwardRef(function WordNarratorRef(
  { words, startAt, duration }: Props,
  ref
) {
  const sentenceWrapper = useRef<HTMLDivElement>(null);

  const isOutOfRange = (currentTime: Seconds) => {
    return (
      startAt > currentTime * 1000 || currentTime * 1000 > startAt + duration
    );
  };
  const getActiveIndex = (currentTime: Seconds) => {
    return words.findIndex((word) => {
      if (currentTime < 0.5) return 0;
      const startAt = word.audioOffset;
      const duration = word.duration;
      if (isOutOfRange(currentTime)) return -1;
      return (
        startAt < currentTime * 1000 && currentTime * 1000 < startAt + duration
      );
    });
  };

  useImperativeHandle(ref, () => ({
    setTime: (currentTime: Seconds) => {
      const wordIndex = getActiveIndex(currentTime);
      if (wordIndex === -1) {
        sentenceWrapper?.current?.childNodes.forEach((item, index) => {
          (item as HTMLElement)?.classList?.remove("active-word");
        });
      }

      sentenceWrapper?.current?.childNodes.forEach((item, index) => {
        if (index !== wordIndex) {
          (item as HTMLElement)?.classList?.remove("active-word");
        }
      });

      const sentenceEle = sentenceWrapper?.current?.childNodes[
        wordIndex
      ] as HTMLElement;
      sentenceEle?.classList?.add("active-word");
    },
    resetNarrator: () => {
      sentenceWrapper?.current?.childNodes.forEach((item, index) => {
        (item as HTMLElement)?.classList?.remove("active-word");
      });
    },
  }));
  return (
    <Box
      ref={sentenceWrapper}
      sx={{
        "&:hover": {
          "& span": {
            color: "white",
          },
        },
      }}
    >
      {words.map((item, index) => (
        <Typography
          component="span"
          mr="3px"
          key={index}
          display="inline-block"
          sx={{
            verticalAlign: "middle",
            marginLeft:
              item.boundaryType.indexOf("PunctuationBoundary") !== -1
                ? "-3px"
                : 0,
            color: "grey",
            fontSize: 18,
            "&.active-word": {
              color: "#381e72 !important",
              background: "#d0bcff",
              borderRadius: "4px",
            },
          }}
        >
          {item.text}
        </Typography>
      ))}
    </Box>
  );
});

export default WordNarrator;
