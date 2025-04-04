import { Box, Typography } from "@mui/material";
import { NextPageContext } from "next";

import useResponsive from "@/utils/useResponsive";
import { ICategory, IPagination } from "@/types";
import "swiper/swiper-bundle.css";
import { AppConfig } from "@/config";
import CardGrid from "@/components/common/CardGrid";

import type { NextPageWithLayout } from "@/pages/_app";

export async function getServerSideProps({ query }: NextPageContext) {
  const categoriesRes = await fetch(AppConfig.apiUrl + "/categories", {
    method: "GET",
  });
  const categories = await categoriesRes.json();
  return {
    props: {
      categories: categories.data as ICategory[],
    },
  };
}
interface Props {
  categories: ICategory[];
  pagination: IPagination;
}

const CategoriesPage: NextPageWithLayout<Props> = ({
  categories,
  pagination,
}: Props) => {
  const responsive = useResponsive();

  return (
    <Box position="relative" minHeight="calc(100vh)" pt="71px">
      <Box p={responsive.size.pagePadding}>
        <Typography variant="h5" fontWeight="600" sx={{ mt: 2, mb: 4 }}>
          Categories
        </Typography>
        {categories && <CardGrid cards={categories} />}
      </Box>
    </Box>
  );
};

export default CategoriesPage;
