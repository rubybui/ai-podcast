import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { HeaderBar, HeaderLink } from "./style";

export default function Header() {
  return (
    <HeaderBar>
      <Box display="flex" gap="6px" alignItems="center">
        <HeaderLink href="/">
          <Image
            src="/img/logo-coderpush.webp"
            width={48}
            height={48}
            alt="logo"
          />
          <Typography fontWeight="700" variant="h5" color="common.white">
            AI Podcast
          </Typography>
        </HeaderLink>
      </Box>
    </HeaderBar>
  );
}
