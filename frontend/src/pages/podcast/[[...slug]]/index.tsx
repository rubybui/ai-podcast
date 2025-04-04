import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Button,
  Snackbar,
  Alert,
  Stack,
  Chip
} from "@mui/material";
import { NextPageContext } from "next";
import Head from "next/head";
import uniqBy from "lodash/uniqBy";
import take from "lodash/take";
import LinkIcon from "@mui/icons-material/Link";

import Narrator from "@/components/Narrator";
import useResponsive from "@/utils/useResponsive";
import { useLocalStorage } from "@/utils/useLocalStorage";
import { IPodcast, IRecentPlayedPodcast } from "@/types";
import { AppConfig } from "@/config";
import ImageFallback from "@/components/common/ImageFallback";
import PodcastListItem from "@/components/common/PodcastListItem";
import { getPodcastThumbnail } from "@/utils";

const MAX_LENGTH_DESCRIPTION = 200;

interface IRelatedTab {
  label: string;
  value: string;
}
interface Props {
  podcast: IPodcast;
  relatedPodcasts: {
    lastestPodcasts: IPodcast[];
    trendingPodcasts: IPodcast[];
  };
}

const AboutPodcast = ({
  podcast,
  showAllDescription,
  shortDescription,
  handleChangeReadDescription
}: {
  podcast: IPodcast;
  showAllDescription?: boolean;
  shortDescription?: string;
  handleChangeReadDescription: () => void;
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle1"
        fontWeight="700"
        color="white"
        fontSize={{ lg: "24px", md: "20px", xs: "18px" }}
      >
        About
      </Typography>
      <Typography
        variant="body1"
        fontWeight="400"
        color="white"
        style={{ display: "inline", overflowWrap: "break-word" }}
      >
        {showAllDescription ? (
          <>{podcast?.description}</>
        ) : (
          <>{shortDescription}</>
        )}
      </Typography>
      {podcast?.description?.length > MAX_LENGTH_DESCRIPTION ? (
        <Button
          variant="text"
          size="small"
          sx={{ p: 1 }}
          onClick={handleChangeReadDescription}
        >
          {" "}
          {showAllDescription ? <>Read less</> : <>Read more</>}
        </Button>
      ) : (
        <></>
      )}
    </Box>
  );
};

export async function getServerSideProps({ query }: NextPageContext) {
  const responseDetail = await fetch(
    AppConfig.apiUrl + `/podcasts/${query.slug}`,
    { method: "GET" }
  );
  const { data: detailPodcast } = await responseDetail.json();
  const podcast = detailPodcast.podcast as IPodcast;

  const responseLatest = await fetch(AppConfig.apiUrl + `/podcasts/latest`, {
    method: "GET"
  });
  let { data: lastestPodcasts } = await responseLatest.json();
  lastestPodcasts = lastestPodcasts.filter(
    (item: IPodcast) => item._id !== podcast._id
  );

  const responseTrending = await fetch(AppConfig.apiUrl + `/podcasts/trending`, {
    method: "GET"
  });
  let { data: trendingPodcasts } = await responseTrending.json();
  trendingPodcasts = trendingPodcasts.filter(
    (item: IPodcast) => item._id !== podcast._id
  );

  return {
    props: {
      podcast,
      relatedPodcasts: {
        lastestPodcasts,
        trendingPodcasts
      }
    }
  };
}

const defaultTabList: IRelatedTab[] = [
  {
    label: "Latest",
    value: "latest"
  },
  {
    label: "Most view",
    value: "most-view"
  }
];

let tabList = defaultTabList;

const PodcastPage = (props: Props) => {
  const { podcast, relatedPodcasts } = props;

  const { lastestPodcasts } = relatedPodcasts;
  const router = useRouter();
  const slug = router.query?.slug?.[0] as string;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [showAllDescription, setShowAllDescription] = useState<boolean>(
    podcast?.description?.length <= MAX_LENGTH_DESCRIPTION
  );
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [recentPodcast, setRecentPodcast] = useLocalStorage<
    IRecentPlayedPodcast[]
  >("recentPodcast", [] as IRecentPlayedPodcast[]);
  const [tab, setTab] = useState<string>("latest");
  const [selectedPodcasts, setSelectedPodcasts] = useState<IPodcast[]>([]);
  const [sameCategoryPodcasts, setSameCategoryPodcasts] =
    useState<Record<string, IPodcast[]>>();

  const responsive = useResponsive();

  useEffect(() => {
    const fetchSameCategoryPodcasts = async () => {
      const categories = podcast?.categories || [];
      const sameCategories = categories.map((cate) => ({
        label: cate.name,
        value: cate._id
      }));
      tabList = defaultTabList;
      tabList = uniqBy([...tabList, ...sameCategories], "value");
      const requests = categories.map((cate) => {
        const params = {
          categories: cate._id
        };
        const queryParams = new URLSearchParams(params).toString();
        const request = fetch(AppConfig.apiUrl + `/podcasts?${queryParams}`, {
          method: "GET"
        });
        return request;
      });

      const responses = await Promise.all(requests);
      const sameCategoryPodcastsResponses = await Promise.all(
        responses.map((res) => res.json())
      );

      const sameCategoryPodcasts = sameCategoryPodcastsResponses.map(
        (item) => item.data
      );
      const sameCategoryPodcastsObject: Record<string, IPodcast[]> = {};
      sameCategoryPodcasts.forEach((items, index) => {
        const key = categories[index]._id;
        const podcasts = items.filter(
          (item: IPodcast) => item._id !== podcast._id
        );
        sameCategoryPodcastsObject[key] = podcasts;
      });
      setSameCategoryPodcasts(sameCategoryPodcastsObject);
    };

    setSelectedPodcasts(relatedPodcasts.lastestPodcasts);
    fetchSameCategoryPodcasts();

    return () => {
      // Set tab to default options
      tabList = defaultTabList;
    };
  }, [podcast]);

  useEffect(() => {
    if (tab === "latest") {
      setSelectedPodcasts(relatedPodcasts.lastestPodcasts);
    } else if (tab === "most-view") {
      setSelectedPodcasts(relatedPodcasts.trendingPodcasts);
    } else {
      if (sameCategoryPodcasts) {
        setSelectedPodcasts(sameCategoryPodcasts[tab]);
      }
    }
  }, [tab]);

  useEffect(() => {
    if (!podcast || podcast.categories?.length === 0) return;

    if (
      podcast &&
      recentPodcast &&
      recentPodcast.findIndex((item) => item._id === podcast._id) === -1
    ) {
      setRecentPodcast([
        {
          _id: podcast._id,
          name: podcast.name,
          primaryImage: podcast.primaryImage,
          slug: podcast.slug
        },
        ...take(recentPodcast, 5)
      ]);
    }
  }, [podcast, recentPodcast, setRecentPodcast]);

  const handleClickBack = () => {
    router.push("/");
  };

  const selectedVariant = useMemo(() => {
    return podcast?.variants[selectedVariantIndex];
  }, [podcast?.variants, selectedVariantIndex]);

  const handleChangeVariant = (index: number) => {
    setSelectedVariantIndex(index);
  };

  const podcastCreatedAt = useMemo(() => {
    if (!podcast) return;

    const createdAt = new Date(podcast?.createdAt);
    const date = createdAt.getDate();
    const month = createdAt.getMonth() + 1;
    const year = createdAt.getFullYear();

    return (
      <>
        {date}/{month}/{year}
      </>
    );
  }, [podcast]);

  const shortDescription = useMemo(() => {
    if (!podcast?.description) return;
    return podcast?.description.slice(0, MAX_LENGTH_DESCRIPTION);
  }, [podcast]);

  const handleChangeReadDescription = () => {
    setShowAllDescription(!showAllDescription);
  };

  const handlePlayNext = () => {
    const nextPodcast = lastestPodcasts.find(
      (item) => item._id !== podcast._id
    );
    if (nextPodcast !== undefined) {
      router.push(`/podcast/${nextPodcast.slug}`);
    }
  };

  const podcastVariantsCount = useMemo(() => {
    if (podcast?.variants?.length > 1) {
      return `• ${podcast?.variants?.length} versions`;
    }
  }, [podcast]);

  const onCopyingUrl = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setShowAlert(true);
    } catch (err) {
      console.error("Error copying text to clipboard: ", err);
    }
  };

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowAlert(false);
  };

  const getPodcastTitleSize = (name: string) => {
    let ratio = 1;
    const nameLength = name.split(" ").length;
    if (nameLength < 8) {
      ratio = 1;
    } else if (nameLength < 14) {
      ratio = 0.8;
    } else if (nameLength < 20) {
      ratio = 0.7;
    } else {
      ratio = 0.55;
    }

    return `${64 * ratio}px`;
  };

  const onTabClick = (value: string) => {
    setTab(value);
  };

  if (!podcast) return null;

  return (
    <Box position="relative" minHeight="calc(100vh)" pt="75px">
      <Head>
        <title>{`${podcast?.name} | AI Podcast`}</title>
        <meta property="og:type" content="media" />
        <meta
          property="og:title"
          content={`${podcast?.name} | AI Podcast`}
          key="title"
        />
        <meta property="image" content={getPodcastThumbnail(podcast)} />
        <meta property="og:image" content={getPodcastThumbnail(podcast)} />
        <meta property="og:image_secure_url" content={getPodcastThumbnail(podcast)} />
        <meta
          property="og:url"
          content={`https://aipodcast.dev/podcast/${slug}`}
        />
        <meta
          property="url"
          content={`https://aipodcast.dev/podcast/${slug}`}
        />
        <meta property="description" content={podcast?.description} />
        <meta property="og:description" content={podcast?.description} />
      </Head>

      <Box p={responsive.size.pagePadding}>
        <Box sx={{ flexGrow: 1 }}>
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
            <Box
              position="relative"
              sx={{
                borderRadius: { xs: "20px", md: "28px" },
                alignSelf: { xs: "center", sm: "flex-start" },
                overflow: "hidden"
              }}
              width={{ xs: "220px", lg: "280px" }}
              height={{ xs: "220px", lg: "280px" }}
            >
              <ImageFallback
                src={
                  getPodcastThumbnail(podcast)
                }
                alt={podcast?.name}
                fill
              />
            </Box>

            <Box
              flex="1"
              ml={{ lg: 4, md: 3, sm: 2, xs: 0 }}
              mt={{ xs: 3, sm: 0 }}
            >
              <Typography variant="body1" fontWeight="400" color="white">
                {selectedVariant?.name}
              </Typography>

              <Typography
                variant="h1"
                fontWeight="700"
                color="white"
                fontSize={{
                  lg: getPodcastTitleSize(podcast.name),
                  md: "36px",
                  xs: "28px"
                }}
              >
                {podcast.name}
              </Typography>

              <Typography variant="body1" fontWeight="400" color="white" mt={2}>
                <>
                  {podcast?.author && <>{podcast?.author} • </>}
                  {podcastCreatedAt} {podcastVariantsCount}
                </>
              </Typography>

              <IconButton
                aria-label="copy"
                sx={{ mt: 1 }}
                onClick={onCopyingUrl}
              >
                <LinkIcon color="primary" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={5}>
              <Grid item xs={12} md={8}>
                <AboutPodcast
                  podcast={podcast}
                  showAllDescription={showAllDescription}
                  shortDescription={shortDescription}
                  handleChangeReadDescription={handleChangeReadDescription}
                />

                {podcast?.variants.length > 0 && (
                  <Narrator
                    variantVersions={selectedVariant?.versions}
                    onPlayNext={handlePlayNext}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                {podcast?.variants.length > 1 && (
                  <Box
                    sx={{
                      background:
                        "linear-gradient(0deg,rgba(208, 188, 255, 0.11),rgba(208, 188, 255, 0.11)),#1c1b1f",
                      p: 2,
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="700"
                      color="white"
                      mb={1}
                      fontSize={{ lg: "24px", md: "20px", xs: "18px" }}
                    >
                      Other Chapters
                    </Typography>
                    <Box>
                      {podcast?.variants.map((variant, index) => {
                        return (
                          selectedVariant?._id !== variant._id && (
                            <Button
                              key={variant._id}
                              variant="outlined"
                              size="small"
                              sx={{ mt: 1 }}
                              fullWidth
                              onClick={() => handleChangeVariant(index)}
                            >
                              {variant.name}
                            </Button>
                          )
                        );
                      })}
                    </Box>
                  </Box>
                )}

                <Box sx={{ my: 2 }}>
                  <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
                    Related podcasts
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    {tabList.map(({ label, value }) => {
                      const isActive = tab === value;
                      return (
                        <Chip
                          key={value}
                          label={label}
                          variant={isActive ? "filled" : "outlined"}
                          onClick={() => onTabClick(value)}
                        />
                      );
                    })}
                  </Stack>

                  <PodcastListItem podcasts={selectedPodcasts} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Snackbar
          open={showAlert}
          autoHideDuration={4_000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Podcast link is copied!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default PodcastPage;
