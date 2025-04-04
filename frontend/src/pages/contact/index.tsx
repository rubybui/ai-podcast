
import { Box, Typography } from "@mui/material";

import type { NextPageWithLayout } from "@/pages/_app";
import "swiper/swiper-bundle.css";

import useResponsive from "@/utils/useResponsive";
import ContactForm from "@/components/common/ContactForm";


const ContactPage: NextPageWithLayout = () => {
  const responsive = useResponsive();

  return (
    <Box position="relative" minHeight="calc(100vh)" pt="71px">
      <Box p={responsive.size.pagePadding}>
        <ContactForm />
      </Box>
    </Box>
  );
};

export default ContactPage;
