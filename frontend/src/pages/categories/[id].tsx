import { useState, useEffect } from "react";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { Box, Typography, Stack, Pagination } from "@mui/material";
import Head from "next/head";

import ImageFallback from "@/components/common/ImageFallback";
import PodcastListItem from "@/components/common/PodcastListItem";
import { AppConfig } from "@/config";
import { BannerOverlay } from "@/styles/home";
import { ICategory, IPagination, IPodcast } from "@/types";
import useResponsive from "@/utils/useResponsive";
import { getImageUrl } from "@/utils";

export async function getServerSideProps({ query }: NextPageContext) {
  const id = query.id as string;
  const page = Number(query.page);
  const [podcastsRes, categoriesRes] = await Promise.all([
    fetch(AppConfig.apiUrl + `/podcasts?categories=${id}&?page=${page}`, {
      method: "GET"
    }),
    fetch(AppConfig.apiUrl + `/categories/${id}`, {
      method: "GET"
    })
  ]);
  const [podcasts, categories] = await Promise.all([
    podcastsRes.json(),
    categoriesRes.json()
  ]);

  return {
    props: {
      categoryInfo: categories.data as ICategory,
      podcasts: podcasts.data as IPodcast[],
      pagination: podcasts.pagination as IPagination
    }
  };
}

interface Props {
  categoryInfo: ICategory;
  podcasts: IPodcast[];
  pagination: IPagination;
}

const CategoryPage = ({ categoryInfo, podcasts, pagination }: Props) => {
  const router = useRouter();
  const responsive = useResponsive();
  const currentPage = Number(pagination.currentPage) || 1;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    router.replace(`/${categoryInfo._id}/page=${value}`);
    setIsRefreshing(true);
  };

  useEffect(() => {
    setIsRefreshing(false);
  }, [podcasts, pagination]);

  return (
    <Box position="relative" minHeight="calc(100vh)" pt="71px">
      <Head>
        <title>{`${categoryInfo?.name} | AI Podcast`}</title>
        <meta property="og:type" content="media" />
        <meta
          property="og:title"
          content={`${categoryInfo?.name} | AI Podcast`}
          key="title"
        />
        <meta
          property="image"
          content={getImageUrl(categoryInfo, "bannerUrl")}
        />
        <meta
          property="og:image"
          content={getImageUrl(categoryInfo, "bannerUrl")}
        />
        <meta
          property="og:image_secure_url"
          content={getImageUrl(categoryInfo, "bannerUrl")}
        />
        <meta
          property="og:url"
          content={`http://aipodcast.dev/categories/${router.query.id}`}
        />
        <meta
          property="url"
          content={`http://aipodcast.dev/categories/${router.query.id}`}
        />
        <meta
          property="description"
          content={`Listen to ${categoryInfo.name} on AI Podcast`}
        />
        <meta
          property="og:description"
          content={`Listen to ${categoryInfo.name} on AI Podcast`}
        />
      </Head>
      <BannerOverlay />
      <Box>
        <Box
          p={responsive.size.pagePadding}
          sx={{ background: "rgba(0,0,0,.3)" }}
        >
          <Box display="flex" flexWrap="wrap" gap="45px">
            <Box>
              <ImageFallback
                width="200"
                height="200"
                src={getImageUrl(categoryInfo, "bannerUrl")}
                alt="category thumbnail"
                style={{ boxShadow: "0px 4px 20px 14px rgba(0, 0, 0, 0.25)" }}
              />
            </Box>
            <Box flex="1">
              <Typography textTransform="uppercase" variant="subtitle2">
                Category
              </Typography>
              <Typography variant="h2" fontWeight="600">
                {categoryInfo.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {podcasts.length} podcasts
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box padding={responsive.size.pagePadding}>
          <PodcastListItem podcasts={podcasts} />
          <Stack alignItems="center" mt="24px">
            <Pagination
              count={pagination.totalPages}
              onChange={handleChangePage}
              color="primary"
              disabled={pagination.totalPages === 0}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryPage;
