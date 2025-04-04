// @ts-nocheck
// https://github.com/react-hook-form/react-hook-form/issues/2922
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

import { speedList, voiceList, toneList } from "./constant";
type Props = {
  index: number;
  key: number;
  handleRemoveFromVariantsList: (number) => void;
};

const CreatePodcastVariant = ({
  index,
  handleRemoveFromVariantsList,
}: Props) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const registerField = (field: string) => {
    return `variants[${index}].${field}`;
  };

  // TS show error on this line but it works perfectly
  // Since it's about the lib and TS it is ignored
  const errorField = (field: string) => {
    if (!errors || !errors?.variants) {
      return;
    }
    return errors?.variants[index]?.[field];
  };

  const contentLength = watch(registerField("content"))?.length || 0;

  const variantName = watch(registerField("variantName"));

  return (
    <Paper elevation={0} sx={{ mt: 3, p: 3, borderRadius: "18px" }}>
      <Box
        mt={2}
        display="flex"
        gap={2}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="subtitle2"> {variantName} Chapter</Typography>
        {index !== 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleRemoveFromVariantsList(index)}
            style={{ borderStyle: "dashed" }}
          >
            Remove
          </Button>
        )}
      </Box>
      <TextField
        fullWidth
        required
        label="Title"
        variant="standard"
        {...register(registerField("variantName"))}
        helperText={(errorField("variantName")?.message as string) || undefined}
      />

      <TextField
        error={Boolean(errorField("content"))}
        required
        focused
        fullWidth
        label="Podcast Content"
        placeholder="Enter your own content to generate podcast"
        multiline
        rows={4}
        sx={{ mt: 4 }}
        {...register(registerField("content"))}
        helperText={(errorField("content")?.message as string) || undefined}
      />
      <Typography variant="subtitle2">{`${contentLength} characters`}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl
            fullWidth
            variant="standard"
            sx={{ mt: "16px" }}
            error={Boolean(errorField("speed"))}
          >
            <InputLabel required id="select-speed">
              Speed
            </InputLabel>
            <Select
              required
              defaultValue={[1]}
              multiple
              labelId="select-speed"
              {...register(registerField("speed"))}
            >
              {speedList.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            {Boolean(errorField("speed")) && (
              <FormHelperText>
                {(errorField("speed")?.message as string) || ""}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl
            fullWidth
            variant="standard"
            sx={{ mt: "16px" }}
            error={Boolean(errorField("voiceName"))}
          >
            <InputLabel required id="select-voice">
              Voice
            </InputLabel>
            <Select
              required
              labelId="select-voice"
              defaultValue=""
              {...register(registerField("voiceName"))}
            >
              {voiceList.map((voice, index) => (
                <MenuItem key={voice.ShortName} value={voice.ShortName}>
                  {voice.DisplayName}
                </MenuItem>
              ))}
            </Select>
            {Boolean(errorField("voiceName")) && (
              <FormHelperText>
                {(errorField("voiceName")?.message as string) || ""}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl
            fullWidth
            variant="standard"
            sx={{ mt: "16px" }}
            error={Boolean(errorField("tone"))}
          >
            <InputLabel required id="select-tone">
              Tone
            </InputLabel>
            <Select
              required
              labelId="select-tone"
              defaultValue=""
              {...register(registerField("tone"))}
            >
              {toneList.map((tone: any, index: number) => (
                <MenuItem key={index} value={tone}>
                  {tone}
                </MenuItem>
              ))}
            </Select>
            {Boolean(errorField("tone")) && (
              <FormHelperText>
                {errorField("tone")?.message as string}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreatePodcastVariant;
