import React, { useState } from "react";
import { TextField, Button, Typography, Box, Grid } from "@mui/material";

import useResponsive from "@/utils/useResponsive";

import type { NextPageWithLayout } from "../_app";

interface JsonObject {
  text: string;
}

const TextToJson: NextPageWithLayout = () => {
  const [inputText, setInputText] = useState("");
  const [jsonObjects, setJsonObjects] = useState<JsonObject[]>([]);
  const responsive = useResponsive();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };
  const handleSplitButtonClick = () => {
    const objects: JsonObject[] = [];
    let currentIndex = 0;

    while (currentIndex < inputText.length) {
      let substr = inputText.substr(currentIndex, 4900);
      const lastDotIndex = substr.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        substr = substr.substr(0, lastDotIndex + 1);
        currentIndex += substr.length;
      } else {
        currentIndex += 4900;
      }

      objects.push({
        text: substr
      });
    }

    setJsonObjects(objects);
  };

  return (
    <Box position="relative" minHeight="calc(100vh)" pt="71px">
      <Box p={responsive.size.pagePadding}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Enter text here"
              multiline
              rows={5}
              fullWidth
              value={inputText}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSplitButtonClick}>
              Split
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">JSON Objects:</Typography>
          </Grid>
          <Grid item xs={12}>
            {jsonObjects.map((obj, index) => (
              <Box key={index} border={1} p={1} mb={1}>
                {obj.text.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TextToJson;
