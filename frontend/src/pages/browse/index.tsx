import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Pagination, Stack } from "@mui/material";
import { NextPageContext } from "next";

import useResponsive from "@/utils/useResponsive";
import { IPagination, IPodcast } from "@/types";
import "swiper/swiper-bundle.css";
import { AppConfig } from "@/config";
import CardGrid from "@/components/common/CardGrid";

import type { NextPageWithLayout } from "@/pages/_app";

export async function getServerSideProps({ query }: NextPageContext) {
  const currentPage = Number(query.page) || 1;

  const podcastsRes = await fetch(
    `${AppConfig.apiUrl}/podcasts?page=${currentPage}`,
    {
      method: "GET",
    }
  );

  const podcasts = await podcastsRes.json();

  return {
    props: {
      podcasts: podcasts.data as IPodcast[],
      pagination: podcasts.pagination as IPagination,
    },
  };
}
interface Props {
  podcasts: IPodcast[];
  pagination: IPagination;
}

const BrowsePage: NextPageWithLayout<Props> = ({
  podcasts,
  pagination,
}: Props) => {
  const responsive = useResponsive();
  const router = useRouter();

  const currentPage = Number(pagination.currentPage) || 1;

  const [searchValue, setSearchValue] = useState<string>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    router.replace(`/browse/?page=${value}`);
    setIsRefreshing(true);
  };

  const onChangeSearch = (value: any) => {
    setSearchValue(value);
    router.replace(`/browse/?page=${1}`);
    setIsRefreshing(true);
  };

  const searchedPodcasts = useMemo(() => {
    if (!searchValue) {
      return podcasts;
    }
    return podcasts.filter((podcast) =>
      podcast.name.toLowerCase().includes(searchValue)
    );
  }, [podcasts, searchValue]);

  useEffect(() => {
    setIsRefreshing(false);
  }, [podcasts, pagination]);

  return (
    <Box position="relative" minHeight="calc(100vh)">
      <Box p={responsive.size.pagePadding}>
        <Typography variant="h5" fontWeight="600" sx={{ mt: 2, mb: 4 }}>
          Browse all
        </Typography>
        {podcasts && <CardGrid cards={searchedPodcasts} />}
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
  );
};

export default BrowsePage;
