import React, { UIEvent, useState } from "react";
import { createApi } from "unsplash-js";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField
} from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";

import { IUnplashPhoto } from "../CreatePodcastForm/types";

import { AppConfig } from "@/config";

const unsplash = createApi({
  accessKey: AppConfig.unsplashAccessKey || ""
});

const SearchWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  paddingInline: 10,
  marginBottom: 10
}));

interface IProps {
  defaultOpen: boolean;
  onModalClose: () => void;
  onPhotoSelect: (photo: IUnplashPhoto) => void;
}

const UnsplashImagePicker = ({
  defaultOpen,
  onModalClose,
  onPhotoSelect
}: IProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<IUnplashPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stopFetch, setStopFetch] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onModalClose();
  };

  const loadPhotos = () => {
    setLoading(true);
    unsplash.search
      .getPhotos({ query: query, page: page, orientation: "squarish" })
      .then((response) => {
        if (response.errors) {
          console.error(response.errors[0]);
        } else {
          const photoList = response.response.results as IUnplashPhoto[];
          if (page > 1 && photoList.length === 0) {
            setStopFetch(true);
          } else {
            setPhotos((prevPhotos) => [...prevPhotos, ...photoList]);
            setPage((prevPage) => prevPage + 1);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleScroll = (e: UIEvent<HTMLDivElement> | undefined) => {
    if (!e) return;
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    const scrollBottom = scrollHeight - (scrollTop + clientHeight);
    if (scrollBottom <= 1 && !loading && !stopFetch) {
      loadPhotos();
    }
  };

  const onSearchReset = () => {
    setStopFetch(false);
    setQuery("");
    setPhotos([]);
    setPage(1);
  };

  const onSearch = () => {
    setStopFetch(false);
    setPhotos([]);
    setPage(1);
    loadPhotos();
  };

  const handleSelect = (photo: IUnplashPhoto) => {
    onPhotoSelect(photo);
    handleClose();
    onSearchReset();
  };

  return (
    <Dialog
      maxWidth={"lg"}
      onClose={() => {
        onSearchReset();
        handleClose();
      }}
      open={defaultOpen}
    >
      <DialogTitle sx={{ pb: 0 }}>Photo from Unsplash</DialogTitle>

      <SearchWrapper>
        <TextField
          label="Search photo"
          type="search"
          variant="standard"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              onSearch();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          fullWidth
        />

        <Button sx={{ mt: 2 }} onClick={() => onSearch()}>
          Search
        </Button>
      </SearchWrapper>

      <Box sx={{ height: 600, overflow: "auto" }} onScroll={handleScroll}>
        <Grid container width={400} spacing={1}>
          {photos.map((photo) => (
            <Grid item key={photo.id} xs={6} position="relative">
              <Image
                src={photo.urls.small_s3}
                alt={photo.alt_description || "unsplash_photo"}
                onClick={() => handleSelect(photo)}
                width="0"
                height="0"
                sizes="100vw"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
              />
            </Grid>
          ))}
        </Grid>

        {loading && (
          <Stack justifyContent="center" direction="row">
            <CircularProgress size={18} />
          </Stack>
        )}
      </Box>
    </Dialog>
  );
};

export default UnsplashImagePicker;
