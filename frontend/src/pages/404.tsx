import Link from "next/link";
import { Box, Button } from "@mui/material";
import Image from "next/image";

import { BannerOverlay } from "@/styles/home";

export default function Custom404() {
  return (
    <Box
      position="relative"
      minHeight="calc(100vh)"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BannerOverlay />
      <Box textAlign="center">
        <Image
          src="/img/no-results.png"
          alt="no result image"
          width="128"
          height="128"
        />

        <h1>404 Page not found</h1>
        <Link href={`/`}>
          <Button>Back to home</Button>
        </Link>
      </Box>
    </Box>
  );
}
