import Head from "next/head";
import { Box } from "@mui/material";
import { ReactNode, useState } from "react";
import { useRouter } from "next/router";

import MastHead from "../common/MastHead";

import { Main } from "./style";
import Sidebar from "./Sidebar";

interface Props {
  children?: ReactNode;
}

export default function AdminPageLayout({ children }: Props) {
  const [openDrawer, setOpenDrawer] = useState(true);
  const router = useRouter();

  const isAdminPage = router.pathname.indexOf("/admin") !== -1;

  const handleCloseDrawer = (open: boolean) => {
    setOpenDrawer(open);
  };

  return (
    <>
      <Head>
        <title>AI Podcast</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box>
        <Sidebar openDrawer={openDrawer} toggleDrawer={handleCloseDrawer} />
        <Main open={openDrawer} isAdminPage={isAdminPage}>
          {!isAdminPage && (
            <MastHead openDrawer={openDrawer} closeDrawer={handleCloseDrawer} />
          )}
          <Box>{children}</Box>
        </Main>
      </Box>
    </>
  );
}
