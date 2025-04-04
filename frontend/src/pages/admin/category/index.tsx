import { Box } from "@mui/material";

import type { NextPageWithLayout } from "../../_app";

const AdminPage: NextPageWithLayout = () => {
  return (
    <Box position="relative" minHeight="calc(100vh)" p={5}>
      Categories
    </Box>
  );
};

AdminPage.auth = true;

export default AdminPage;
