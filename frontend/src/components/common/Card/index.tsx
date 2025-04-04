import { Box, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";

import { ICategory, IPodcast } from "@/types";
import { AppConfig } from "@/config";
import useResponsive from "@/utils/useResponsive";
import ImageFallback from "@/components/common/ImageFallback";
import { getImageUrl } from "@/utils";

type Card = IPodcast | ICategory;

interface Props {
  card: Card;
}

const Card = ({ card }: Props) => {
  const responsive = useResponsive();

  const isPodcastCard = useMemo(() => "slug" in card, [card]);

  return (
    <Box textAlign="center">
      <Link
        href={
          "slug" in card ? `/podcast/${card.slug}` : `/categories/${card._id}`
        }
      >
        <Box sx={{ position: "relative" }} height={0} paddingBottom="100%">
          <ImageFallback
            src={
              getImageUrl(card, 'primaryImage' in card ? 'primaryImage' : 'bannerUrl')
            }
            alt={card.name}
            style={{ borderRadius: 8 }}
            fill
            sizes="(max-width: 768px) 33vw,
              (max-width: 1200px) 50vw,
              100vw"
          />
        </Box>
        {isPodcastCard && (
          <Typography
            color="white"
            sx={{
              mt: 1,
              textAlign: "left",
              fontSize: 13,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {card.name}
          </Typography>
        )}
      </Link>
    </Box>
  );
};

export default Card;
