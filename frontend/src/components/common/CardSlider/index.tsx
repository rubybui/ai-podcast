import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Box, Typography } from "@mui/material";

import CardSliderStyle from "./CardSlider.module.scss";

import Card from "@/components/common/Card";
import TrendingCard from "@/components/common/TrendingCard";
import { ICategory, IPodcast } from "@/types";

import "swiper/swiper-bundle.css";

type Cards = IPodcast[] | ICategory[];

interface Props {
  title?: string;
  variant?: string;
  cards: Cards;
}

const CardSlider = ({ title, variant, cards }: Props) => {
  return (
    <Box className={CardSliderStyle.CardSlider}>
      {cards && (
        <Box mb={3}>
          {title && (
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{
                mb: 2,
              }}
            >
              {title}
            </Typography>
          )}
          <Swiper
            spaceBetween={15}
            slidesPerView={variant === "trending" ? 1 : 2}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            navigation
            breakpoints={{
              768: {
                spaceBetween: 20,
                slidesPerView: variant === "trending" ? 2 : 3,
              },
              1024: {
                spaceBetween: 25,
                slidesPerView: variant === "trending" ? 2 : 5,
              },
              1440: {
                spaceBetween: 35,
                slidesPerView: variant === "trending" ? 3 : 6,
              },
              1800: {
                spaceBetween: 35,
                slidesPerView: variant === "trending" ? 4 : 8,
              },
            }}
          >
            {cards.map((card) => (
              <SwiperSlide key={card._id}>
                {variant === "trending" ? (
                  <TrendingCard podcast={card as IPodcast} />
                ) : (
                  <Card card={card} />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
};

export default CardSlider;
