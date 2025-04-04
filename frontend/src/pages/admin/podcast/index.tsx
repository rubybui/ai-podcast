import { useState } from "react";
import { NextPageContext } from "next";
import Link from "next/link";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  TablePagination,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import type { NextPageWithLayout } from "../../_app";
import type { IPagination, IPodcast } from "@/types";

import { AppConfig } from "@/config";
import { useRouter } from "next/router";



export async function getServerSideProps({query} : NextPageContext) {
  const currentPage = Number(query.page);

  const podcastsRes = await fetch(AppConfig.apiUrl + `/podcasts?page=${currentPage}`, {
    method: "GET",
  });

  const podcasts = await podcastsRes.json();

  return {
    props: {
      podcasts: podcasts?.data as IPodcast[],
      pagination: podcasts?.pagination as IPagination,
    },
  };
}

interface Props {
  podcasts: IPodcast[];
  pagination: IPagination;
}

const AdminPage: NextPageWithLayout<Props> = ({ podcasts, pagination }) => {
  const currentPage = Number(pagination.currentPage) || 1;
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);


  const ROWS_PER_PAGE = pagination.perPage;

  const handleChangePage = (
    event: unknown,
    page: number,
  ) => {
    if (page > 0) {
    router.replace(`/admin/podcast?page=${page}`);
    setIsRefreshing(true);
    }
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

  if (!podcasts) return <></>;

  return (
    <Box position="relative" minHeight="calc(100vh)" p={5}>
      <Typography variant="h5">Podcasts</Typography>
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
                .map((podcast) => (
                  <TableRow
                    key={podcast._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {podcast.name}
                    </TableCell>
                    <TableCell align="left">{podcast.author}</TableCell>
                    <TableCell align="right">
                      {podcastCreatedAt(podcast.createdAt)}
                    </TableCell>
                    <TableCell align="right">{podcast.views}</TableCell>
                    <TableCell align="right">
                      <Link href={`/podcast/${podcast.slug}`} target="_blank">
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
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          component="div"
          count={ROWS_PER_PAGE}
          rowsPerPage={ROWS_PER_PAGE}
          page={currentPage}
          onPageChange={(event, page) => handleChangePage(event, page)}
          backIconButtonProps={{"disabled": currentPage === 1}}
          nextIconButtonProps={{"disabled": currentPage === pagination.totalPages}}
        />
      </Box>
    </Box>
  );
};

AdminPage.auth = true;

export default AdminPage;
