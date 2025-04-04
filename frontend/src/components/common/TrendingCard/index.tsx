import Link from "next/link";
import { Box, Typography } from "@mui/material";

import { IPodcast } from "@/types";
import { AppConfig } from "@/config";
import ImageFallback from "@/components/common/ImageFallback";
import { getPodcastThumbnail } from "@/utils";

interface Props {
  podcast: IPodcast;
}

const TrendingCard = ({ podcast }: Props) => {
  return (
    <Box textAlign="center">
      <Link href={`/podcast/${podcast.slug}`}>
        <Box
          sx={{
            borderRadius: 2,
            minHeight: "120px",
            background: "#49454f",
            overflow: "hidden",
            height: "150px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <ImageFallback
              src={
                getPodcastThumbnail(podcast)
              }
              alt={podcast.name}
              width={150}
              height={150}
              sx={{ objectFit: "cover" }}
            />
            <Box p={1} flex={1}>
              <Typography
                color="white"
                align="left"
                sx={{
                  fontSize: 16,
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  margin: "auto",
                }}
              >
                {podcast.name}
              </Typography>
              <Box mt={1}>
                <Typography
                  color="#b6b6b6"
                  align="left"
                  sx={{
                    fontWeight: 400,
                    fontSize: ".875rem",
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    margin: "auto",
                  }}
                >
                  {podcast.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export default TrendingCard;
