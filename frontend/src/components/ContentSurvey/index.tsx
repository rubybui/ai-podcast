import { useEffect, useRef, useState } from "react";
import { Box, Chip, IconButton, Input, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import CloseIcon from "@mui/icons-material/Close";

import SurveyItem from "./SurveyItem";

import { ISurvey } from "@/types";
import { AppConfig } from "@/config";

const ContentSurvey = () => {
  //get the survey data from the backend with endpoint '/api/survey'
  const [survey, setSurvey] = useState<ISurvey[]>([] as ISurvey[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [voted, setVoted] = useState(false);
  const [newOption, setNewOption] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState("");
  const newOptionRef = useRef<HTMLInputElement>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const getSurvey = async () => {
      try {
        const response = await fetch(AppConfig.apiUrl + "/survey");
        const data = await response.json();
        if (!data.data || data.data.length === 0) {
          setLoading(false);
          setClosed(true);
          return;
        }

        setSurvey((data.data || []) as ISurvey[]);
        setLoading(false);
      } catch (error) {
        setClosed(true);
        setError(true);
        setLoading(false);
      }
    };
    getSurvey();
  }, []);

  const handleAddOption = () => {
    setNewOption(true);
    newOptionRef?.current?.click();
  };

  const handleAddOptionSubmit = async () => {
    if (newOptionValue.length < 3) return;
    try {
      const response = await fetch(AppConfig.apiUrl + "/survey/add-option", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ option: newOptionValue }),
      });
      const data = await response.json();

      if (data.success) {
        setNewOption(false);
        setNewOptionValue("");
      }
    } catch (error) {
      setError(true);
    }
  };

  const handleSpecialKey = (e: React.KeyboardEvent) => {
    e.preventDefault();

    if (e.key === "Enter") {
      handleAddOptionSubmit();
    }
    if (e.key === "Escape") {
      setNewOption(false);
      setNewOptionValue("");
    }
  };

  const handleBlurNewOption = () => {
    setNewOption(false);
    setNewOptionValue("");
  };

  if (loading) {
    return (
      <Box padding={2} sx={{ background: "#49454F" }}>
        Loading...
      </Box>
    );
  }
  if (!loading && error) {
    return (
      <Box padding={2} sx={{ background: "#49454F" }}>
        Something went wrong!
      </Box>
    );
  }

  if (voted) {
    return (
      <Box padding={2} sx={{ background: "#49454F" }}>
        <Typography>Thank you for your vote!</Typography>
      </Box>
    );
  }

  if (closed) {
    return <></>;
  }

  return (
    <Box
      padding={2}
      mb={2}
      sx={{ background: "#49454F", borderRadius: "8px" }}
      position="relative"
    >
      <Typography mb={1}>What else do you want to listen?</Typography>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <Stack direction="row" spacing={2} flexWrap={{ xs: "wrap" }} rowGap={1}>
          {
            //map the survey data to the Chip component
            survey.map((item) => (
              <SurveyItem key={item.id} name={item.name} id={item.id} />
            ))
          }
          <Box>
            <Input
              value={newOptionValue}
              ref={newOptionRef}
              sx={{
                transition: "width 0.4s ease",
                width: newOption ? "120px" : 0,
                overflow: "hidden",
              }}
              endAdornment={
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleAddOptionSubmit}
                >
                  <KeyboardReturnIcon fontSize="small" />
                </IconButton>
              }
              onKeyUp={handleSpecialKey}
              onChange={(e) => setNewOptionValue(e.target.value)}
              onBlur={handleBlurNewOption}
            />
            {!newOption && (
              <IconButton
                size="small"
                color="primary"
                onClick={handleAddOption}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Stack>
      </Box>
      <IconButton
        sx={{ position: "absolute", right: "5px", top: "5px" }}
        onClick={() => setClosed(true)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ContentSurvey;
