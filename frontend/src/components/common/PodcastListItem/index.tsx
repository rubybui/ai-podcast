import { Box, Stack, Typography } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";

import CircleIcon from "@mui/icons-material/Circle";

import ImageFallback from "../ImageFallback";

import { AppConfig } from "@/config";
import { IPodcast } from "@/types";
import { formatNumber,getPodcastThumbnail } from "@/utils";

dayjs.extend(relativeTime);

interface Props {
  podcasts: IPodcast[];
}

const PodcastListItem = ({ podcasts }: Props) => {
  return (
    <Box>
      {podcasts.map((podcast) => {
        const createDate = new Date(podcast.createdAt);
        const createDateDiff = dayjs()
          .locale("en")
          .from(dayjs(createDate), true);

        return (
          <Box
            key={podcast._id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="8px 0"
            borderBottom="1px solid #2B2B2B"
            width={370}
          >
            <Box display="flex" alignItems="center" gap="10px" width="100%">
              <Box>
                <Link href={`/podcast/${podcast.slug}`}>
                  <ImageFallback
                    src={
                      getPodcastThumbnail(podcast)
                    }
                    alt={podcast.name}
                    width={75}
                    height={75}
                    style={{ borderRadius: 3 }}
                  />
                </Link>
              </Box>

              <Box width="100%">
                <Link href={`/podcast/${podcast.slug}`}>
                  <Stack>
                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      color="white"
                      fontSize={16}
                      lineHeight={1.3}
                      className="ellipsis"
                    >
                      {podcast.name}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      color="#d8d8d8"
                      fontSize={13}
                      mt={1}
                      lineHeight={1.1}
                    >
                      {podcast.author || ""}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="subtitle2"
                        fontWeight="500"
                        color="#d8d8d8"
                        fontSize={13}
                        lineHeight={1.1}
                      >
                        {formatNumber(podcast.views ?? 0)} views
                      </Typography>

                      <Box color="#d8d8d8">
                        <CircleIcon
                          color="inherit"
                          sx={{ fontSize: "4px", mb: "3px" }}
                        />
                      </Box>

                      <Typography
                        variant="subtitle2"
                        fontWeight="500"
                        color="#d8d8d8"
                        fontSize={13}
                        lineHeight={1.1}
                      >
                        {createDateDiff} ago
                      </Typography>
                    </Stack>
                  </Stack>
                </Link>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default PodcastListItem;
