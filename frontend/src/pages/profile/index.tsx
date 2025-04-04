import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import useResponsive from "@/utils/useResponsive";
import { AppConfig } from "@/config";

import type { IPodcast } from "@/types";
import type { NextPageWithLayout } from "../_app";

const ProfilePage: NextPageWithLayout = () => {
  const responsive = useResponsive();
  const { data: session } = useSession();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [podcasts, setPodcasts] = useState<IPodcast[]>();

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchPodcast = async () => {
      const podcastsRes = await fetch(
        AppConfig.apiUrl +
          `/podcasts/myPodcasts?email=${session?.user?.email}&author=${session?.user?.name}`,
        {
          method: "GET",
        }
      );

      const podcasts = await podcastsRes?.json();
      setPodcasts(podcasts?.data);
    };
    fetchPodcast();
  }, [session?.user?.email, session?.user?.name]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const podcastCreatedAt = (podcastCreatedAt: Date) => {
    const createdAt = new Date(podcastCreatedAt);
    const date = createdAt.getDate();
    const month = createdAt.getMonth() + 1;
    const year = createdAt.getFullYear();

    return (
      <>
        {date}/{month}/{year}
      </>
    );
  };

  return (
    <Box position="relative" minHeight="calc(100vh)" pt="71px">
      <Box p={responsive.size.pagePadding}>
        {session && session.user ? (
          <>
            <div>
              <Avatar
                src={session.user?.image || ""}
                sx={{ width: 100, height: 100 }}
              />
              <Box mt={1}>
                <Typography variant="h5" fontWeight="600">
                  {session.user?.name}
                </Typography>
                <Typography>{session.user?.email}</Typography>
              </Box>

              {podcasts && (
                <>
                  <Box mt={3}>
                    <Typography variant="h5">
                      <>{session?.user.name}</>
                      &apos;s podcasts
                    </Typography>
                    <Box mt={2}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell align="left">Author</TableCell>
                              <TableCell align="right">Created at</TableCell>
                              <TableCell align="right">Views</TableCell>
                              <TableCell align="right">Link</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {podcasts
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((podcast) => (
                                <TableRow
                                  key={podcast._id}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    {podcast.name}
                                  </TableCell>
                                  <TableCell align="left">
                                    {podcast.author}
                                  </TableCell>
                                  <TableCell align="right">
                                    {podcastCreatedAt(podcast.createdAt)}
                                  </TableCell>
                                  <TableCell align="right">
                                    {podcast.views}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Link
                                      href={`/podcast/${podcast.slug}`}
                                      target="_blank"
                                    >
                                      <IconButton>
                                        <LaunchIcon />
                                      </IconButton>
                                    </Link>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={podcasts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </div>
          </>
        ) : (
          <Typography variant="h5" fontWeight="600" sx={{ mt: 2, mb: 4 }}>
            Please login to see your profile
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
