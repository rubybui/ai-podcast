//create an modal component using Dialog from mui, add a timer of 5 seconds and then close the modal

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onAbort: () => void;
}

const COUNTDOWN = 5;

const AutoplayDialog = ({ open, onClose, onConfirm, onAbort }: Props) => {
  const [value, setValue] = useState(COUNTDOWN);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (open) {
      interval = setInterval(() => {
        setValue((prev) => {
          if (prev === 1) {
            onConfirm();
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setValue(COUNTDOWN);
    }
    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        padding={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={3}
      >
        <Typography>Next in</Typography>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={(value / COUNTDOWN) * 100}
            size={60}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body1"
              component="div"
              color="text.secondary"
            >{`${Math.round(value)}s`}</Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Button onClick={onAbort}>Cancel</Button>
          <Button variant="contained" onClick={onConfirm}>
            Play Now
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AutoplayDialog;
