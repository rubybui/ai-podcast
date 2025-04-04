import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";

import type H5AudioPlayer from "react-h5-audio-player";

import { Seconds } from "@/types";
;("use client");
interface Props {
  audioSrc?: string;
  autoPlay?: boolean;
  startAt: Seconds;
  onPlay?: (e: any) => void;
  onSeeked: (e: any) => void;
  onPause?: (e: any) => void;
  onEnded?: (e: any) => void;
  onCurrentTimeChange: (currentTime: Seconds) => void;
}

export default function Player({
  autoPlay = false,
  audioSrc,
  startAt,
  onPlay,
  onSeeked,
  onPause,
  onCurrentTimeChange,
  onEnded,
}: Props) {
  const playerRef = useRef<H5AudioPlayer>(null);

  useEffect(() => {
    const player = playerRef?.current?.audio.current;
    const onTimeUpdate = () => {
      onCurrentTimeChange(
        playerRef?.current?.audio?.current?.currentTime as Seconds
      );
    };
    // player?.addEventListener("timeupdate", onTimeUpdate);
    // return () => player?.removeEventListener("timeupdate", onTimeUpdate);
    const getCurrentTime = setInterval(onTimeUpdate, 100)
    return () => clearInterval(getCurrentTime)
  }, [onCurrentTimeChange])

  useEffect(() => {
    if (playerRef?.current?.audio && playerRef?.current?.audio?.current) {
      if( playerRef.current.audio.current.preload === "none") {
        playerRef.current.audio.current.preload = "metadata";
      }
    }
  }, [audioSrc]);

  useEffect(() => {
    if (
      playerRef?.current?.audio &&
      playerRef?.current?.audio?.current?.currentTime
    ) {
      playerRef.current.audio.current.currentTime = Math.max(
        startAt / 1000 - 0.4,
        0
      );
      playerRef.current.audio.current.play()
    }
  }, [startAt]);

  return (
    <AudioPlayer
      autoPlay={autoPlay}
      preload="none"
      src={audioSrc}
      onPlay={onPlay}
      onSeeked={onSeeked}
      onPause={onPause}
      onEnded={onEnded}
      progressUpdateInterval={100}
      ref={playerRef}
      // other props here
    />
  )
}
