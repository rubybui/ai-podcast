import { useRef, useState, useMemo, useEffect } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Switch,
  Typography
} from "@mui/material";

import Player from "../Player";

import SentenceNarrator from "./SentenceNarrator";
import AutoplayDialog from "./AutoplayDialog";

import {
  speedList,
  longVoiceList
} from "@/components/common/CreatePodcastVariant/constant";
import { IAudio } from "@/types";
import { Seconds } from "@/types";
import { AppConfig } from "@/config";
import { useLocalStorage } from "@/utils/useLocalStorage";


interface Props {
  variantVersions?: IAudio[];
  onPlayNext?: () => void;
}

export default function Narrator({ variantVersions, onPlayNext }: Props) {
  const positionSecondsRef = useRef<Seconds>(0 as Seconds);
  const synthesizeRef = useRef<any>(null);
  const [autoplayLocalValue, setAutoplayLocalValue] = useLocalStorage(
    "autoplay",
    "false"
  );

  const [seekAt, setSeekAt] = useState<Seconds>(0 as Seconds);

  const [autoplay, setAutoplay] = useState(false);
  const [openCountdownDialog, setCountdownDialog] = useState(false);

  const selectedNormalVersiosnIndex = useMemo(() => {
    const firstNormalSpeedVersion = variantVersions?.findIndex(
      (version) => version.speed === 1
    );
    if (firstNormalSpeedVersion && firstNormalSpeedVersion !== -1) {
      return firstNormalSpeedVersion;
    }
    return 0;
  }, [variantVersions]);
  const [currentVersion, setCurrentVersion] = useState(
    selectedNormalVersiosnIndex
  );

  const handleCurrentTimeChange = (currentTime: Seconds) => {
    positionSecondsRef.current = currentTime;
    synthesizeRef?.current?.setCurrentTime(currentTime);
  };

  useEffect(() => {
    setAutoplay(autoplayLocalValue === "true");
  }, [autoplayLocalValue]);

  const handleSeek = (time: Seconds) => {
    setSeekAt(time);
  };

  const handleChangeSpeed = (event: any) => {
    setCurrentVersion(event.target.value);
  };

  const handleAudioSeeked = (e: any) => {
    synthesizeRef?.current?.resetNarrator();
  };

  const variantAudios = useMemo(
    () =>
      variantVersions?.map((version) => {
        return AppConfig.imageUrl + `/${version.audioName}`;
      }),
    [variantVersions]
  );

  const variantTranscripts = useMemo(
    () =>
      variantVersions?.map((version) => {
        return version.transcript;
      }),
    [variantVersions]
  );

  const beautifySpeedVoice = (version: IAudio) => {
    const convert = {
      speed: speedList.find(
        (sourceSpeed) => sourceSpeed.value === version.speed
      )?.label,
      voiceName: longVoiceList.find(
        (sourceVoice) => sourceVoice.ShortName === version.voiceName
      )?.DisplayName
    };

    return `${convert.speed || "Normal"} - ${convert.voiceName || "Old voice"}`;
  };

  const handleAutoplaySwitch = (e: any) => {
    setAutoplayLocalValue(e.target.checked.toString());
  };

  const handleEndOfAudio = () => {
    if (autoplay) {
      setCountdownDialog(true);
    }
  };

  const handleCountdownDialogConfirm = () => {
    setCountdownDialog(false);
    onPlayNext?.();
  };

  return (
    <Box>
      <Player
        startAt={seekAt}
        audioSrc={variantAudios ? variantAudios[currentVersion] : ""}
        onCurrentTimeChange={handleCurrentTimeChange}
        onSeeked={handleAudioSeeked}
        onEnded={handleEndOfAudio}
      />
      <Box display="flex" alignItems="center" mt={1} justifyContent="flex-end">
        <Typography mr={1} fontWeight="400">
          Speed & Voice
        </Typography>
        <FormControl size="small">
          <Select value={currentVersion} onChange={handleChangeSpeed}>
            {variantVersions?.map((version, index) => (
              <MenuItem key={index} value={index}>
                {beautifySpeedVoice(version)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch onChange={handleAutoplaySwitch} checked={autoplay} />
            }
            label="Autoplay"
            sx={{ ml: 3 }}
          />
        </FormGroup>
        <AutoplayDialog
          open={openCountdownDialog}
          onClose={() => setCountdownDialog(false)}
          onAbort={() => setCountdownDialog(false)}
          onConfirm={handleCountdownDialogConfirm}
        />
      </Box>
      <SentenceNarrator
        ref={synthesizeRef}
        onSeek={handleSeek}
        transcript={
          variantTranscripts ? variantTranscripts[currentVersion] : []
        }
      />
    </Box>
  );
}
