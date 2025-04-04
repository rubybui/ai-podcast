import { useState } from "react";
import { useRouter } from "next/router";
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";

import useResponsive from "@/utils/useResponsive";
import { AppConfig } from "@/config";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  anonymous: boolean;
};

const ContactForm = () => {
  const responsive = useResponsive();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "Report Bug",
    message: "",
    anonymous: false
  });
  const greeting =
    "We're excited to hear from you! Whether you have a question or feedback, let's connect and start a conversation.";

  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      subject: value as string
    });
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleAddReportRowSubmit();
  };

  const handleAddReportRowSubmit = async () => {
    console.log("Inside handleAddReportRowSubmit");
    if (formData.message.length <= 10) return;
    try {
      const response = await fetch(AppConfig.apiUrl + "/survey/add-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          anonymous: formData.anonymous
        })
      });
      const data = await response.json();

      if (data.success) {
        setSuccessDialogVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Paper elevation={0} sx={{ mt: 3, p: 3, borderRadius: "18px" }}>
      <Typography variant="h6" textAlign="start">
        Contact Us
      </Typography>
      <Typography variant="subtitle1" textAlign="start" sx={{ mt: 3 }}>
        {greeting}
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        {!formData.anonymous && (
          <Box style={{ width: "100%" }}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              variant="standard"
              multiline
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mt: "16px" }}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              variant="standard"
              multiline
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mt: "16px" }}
            />
          </Box>
        )}
        <FormControl required sx={{ mt: "16px" }} variant="standard" fullWidth>
          <InputLabel id="subject-label">Subject</InputLabel>
          <Select
            labelId="subject-label"
            id="subject-select"
            value={formData.subject}
            onChange={(e) => handleSelectChange}
          >
            <MenuItem value="Report Bug">Report Bug</MenuItem>
            <MenuItem value="Suggestion">Suggestion</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          variant="standard"
          multiline
          label="How can we improve?"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={4}
          required
          sx={{ mt: "16px" }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.anonymous}
              onChange={handleInputChange}
              name="anonymous"
              color="primary"
            />
          }
          label="Submit anonymously"
          sx={{ alignSelf: "start", mt: "16px" }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          size="small"
          style={{
            width: responsive ? "100%" : "50%",
            marginTop: "16px"
          }}
        >
          Submit
        </Button>
      </Box>
      <Dialog
        open={successDialogVisible}
        keepMounted
        onClose={() => setSuccessDialogVisible(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Success!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Thank you for your feedback!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogVisible(false)}>OK</Button>
          <Button onClick={() => router.push("/")}>Home</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ContactForm;
