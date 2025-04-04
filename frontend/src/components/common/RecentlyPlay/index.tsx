//write a recently played podcast component, listing out the most recent podcasts played by the user from local storage
//import the component into the home page
//add the component to the home page

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ImageFallback from "../ImageFallback";

import { IRecentPlayedPodcast } from "@/types";
import { useLocalStorage } from "@/utils/useLocalStorage";
import { AppConfig } from "@/config";
import { getPodcastThumbnail } from "@/utils";

("use client");

const RecentlyPlayed = () => {
  const [recentPodcast] = useLocalStorage<IRecentPlayedPodcast[]>(
    "recentPodcast",
    [] as IRecentPlayedPodcast[]
  );

  if (!recentPodcast.length) {
    return null;
  }

  return (
    <Box mt={4}>
      <Typography variant="h5" fontWeight="600" sx={{ mb: 4 }}>
        Recently Played
      </Typography>
      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          lg: "repeat(3,minmax(0,1fr))",
          sm: "repeat(2,minmax(0,1fr))",
          xs: "repeat(1,minmax(0,1fr))",
        }}
      >
        {recentPodcast &&
          recentPodcast.map((podcast) => (
            <Link href={`/podcast/${podcast.slug}`} key={podcast._id}>
              <Box
                alignItems="center"
                display="flex"
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <ImageFallback
                  src={
                    getPodcastThumbnail(podcast)
                    
                  }
                  alt={podcast.name}
                  width={80}
                  height={80}
                />
                <Box flex="1" color="common.white" padding={1}>
                  {podcast.name}
                </Box>
              </Box>
            </Link>
          ))}
      </Box>
    </Box>
  );
};

export default RecentlyPlayed;
