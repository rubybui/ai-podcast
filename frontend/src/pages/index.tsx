import Image from "next/image";
import { Box } from "@mui/material";
import Head from "next/head";

import type { NextPageWithLayout } from "@/pages/_app";

import { Banner, BannerOverlay } from "@/styles/home";
import { AppConfig } from "@/config";
import { IPodcast, ICategory } from "@/types";
import useResponsive from "@/utils/useResponsive";
import RecentlyPlayed from "@/components/common/RecentlyPlay";
import CardSlider from "@/components/common/CardSlider";
import ContentSurvey from "@/components/ContentSurvey";

const BOOK_CATE_ID = "640aa679d1ed6bcbb5e65e1d";
const HORROR_CATE_ID = "643616b61a9b62193843bcc1";
const CRIMINAL_CATE_ID = "643615ee1a9b62193843bcbb";
const TV_FILM_CATE_ID = "640810757c62e39e4e6a787b";

export async function getServerSideProps() {
  const [
    trendingPodcastsRes,
    latestPodcastsRes,
    bookRes,
    tvAndFilmPodcastsRes,
    crimeAndHorrorPodcastsRes
  ] = await Promise.all([
    fetch(AppConfig.apiUrl + "/podcasts/trending", {
      method: "GET"
    }),
    fetch(AppConfig.apiUrl + "/podcasts/latest", {
      method: "GET"
    }),
    fetch(AppConfig.apiUrl + `/podcasts?categories=${BOOK_CATE_ID}`, {
      method: "GET"
    }),
    fetch(AppConfig.apiUrl + `/podcasts?categories=${TV_FILM_CATE_ID}`, {
      method: "GET"
    }),
    fetch(
      AppConfig.apiUrl +
        `/podcasts?categories=${CRIMINAL_CATE_ID}&categories=${HORROR_CATE_ID}`,
      {
        method: "GET"
      }
    )
  ]);
  const [
    trendingPodcasts,
    latestPodcasts,
    booksPodcasts,
    tvAndFilmPodcasts,
    crimeAndHorrorPodcasts
  ] = await Promise.all([
    trendingPodcastsRes.json(),
    latestPodcastsRes.json(),
    bookRes.json(),
    tvAndFilmPodcastsRes.json(),
    crimeAndHorrorPodcastsRes.json()
  ]);
  return {
    props: {
      trendingPodcasts: trendingPodcasts.data as IPodcast[],
      latestPodcasts: latestPodcasts?.data as IPodcast[],
      booksPodcasts: booksPodcasts?.data as IPodcast[],
      tvAndFilmPodcasts: tvAndFilmPodcasts?.data as IPodcast[],
      crimeAndHorrorPodcasts: crimeAndHorrorPodcasts?.data as IPodcast[]
    }
  };
}

interface Props {
  trendingPodcasts: IPodcast[];
  latestPodcasts: IPodcast[];
  booksPodcasts: IPodcast[];
  crimeAndHorrorPodcasts: IPodcast[];
  tvAndFilmPodcasts: IPodcast[];
}

const Home: NextPageWithLayout<Props> = ({
  trendingPodcasts,
  latestPodcasts,
  booksPodcasts,
  crimeAndHorrorPodcasts,
  tvAndFilmPodcasts
}) => {
  const responsive = useResponsive();

  return (
    <Box position="relative" minHeight="calc(100vh)" pt="71px">
      <Head>
        <meta property="og:type" content="media" />
        <meta property="type" content="media" />
        <meta property="title" content="AI Podcast" key="title" />
        <meta property="og:title" content="AI Podcast" key="title" />

        <meta property="image" content="/img/homeBanner.png" />
        <meta property="og:image" content="/img/homeBanner.png" />
        <meta property="og:image_secure_url" content="/img/homeBanner.png" />
        <meta property="og:url" content="http://aipodcast.dev" />
        <meta property="url" content="http://aipodcast.dev" />
        <meta
          property="description"
          content="Listen and generate your own podcasts"
        />
        <meta
          property="og:description"
          content="Listen and generate your own podcasts"
        />
      </Head>
      <BannerOverlay />

      <Box p={responsive.size.pagePadding}>
        <CardSlider
          title="Popular & trending"
          variant="trending"
          cards={trendingPodcasts}
        />

        <ContentSurvey />

        <CardSlider title="Latest" cards={latestPodcasts} />

        <CardSlider title="Books" cards={booksPodcasts} />

        <CardSlider title="Film Review" cards={tvAndFilmPodcasts} />

        <CardSlider title="Horrors and Criminal" cards={crimeAndHorrorPodcasts} />

        <RecentlyPlayed />
      </Box>
    </Box>
  );
};

export default Home;
