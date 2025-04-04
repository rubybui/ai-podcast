import { Avatar, Chip, CircularProgress } from "@mui/material";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";

import { AppConfig } from "@/config";

interface Props {
  name: string;
  id: string;
}
const SurveyItem = ({ name, id }: Props) => {
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVote = async (id: string) => {
    if (voted) return;
    try {
      setLoading(true);
      const response = await fetch(AppConfig.apiUrl + `/survey/vote/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setVoted(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };
  return (
    <Chip
      avatar={
        voted ? (
          <Avatar>
            <CheckIcon />
          </Avatar>
        ) : undefined
      }
      clickable={!voted}
      label={
        <>
          {loading ? <CircularProgress size={16} /> : null} {name}
        </>
      }
      color="primary"
      variant="outlined"
      onClick={() => handleVote(id)}
      sx={{ marginLeft: "8px !important" }}
    />
  );
};

export default SurveyItem;
