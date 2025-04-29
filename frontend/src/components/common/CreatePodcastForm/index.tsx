import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import { useState } from "react";

import UploadButton from "../UploadButton";
import UnsplashImagePicker from "../UnsplashImagePicker";

import { IUnplashPhoto } from "./types";
import CreateCategoryForm from "@/components/common/CreateCategoryForm"; // correct path if needed

import { ICategory } from "@/types";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

interface Props {
  categoryList: ICategory[];
}

const CreatePodcastForm = ({ categoryList }: Props) => {
  const {
    register,
    setValue,
    formState: { errors }
  } = useFormContext();

  const [validateFile, setValidateFile] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [openPicker, setOpenPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState(false);

  const handleFileChange = (filePath: string) => {
    setValue("primaryImage", filePath);
  };

  const onPhotoSelect = (photo: IUnplashPhoto) => {
    const url = photo.urls.small_s3;
    handleFileChange(url);
    setImage(url);
    setShowModal(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={7} xs={12}>
        <Typography variant="subtitle2">Podcast Info</Typography>
        <Box mt={3}>
          <TextField
            required
            fullWidth
            label="Title"
            variant="standard"
            {...register("name")}
            error={!!errors?.name}
            helperText={(errors?.name?.message as string) || undefined}
          />

          <FormControl
            fullWidth
            variant="standard"
            sx={{ mt: "16px" }}
            error={!!errors?.categories}
          >
            <InputLabel required id="demo-multiple-name-label">
              Category
            </InputLabel>

            <Select
              defaultValue={[]}
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              MenuProps={MenuProps}
              {...register("categories")}
            >
              {categoryList.map(({ name, _id }) => (
                <MenuItem key={_id} value={_id}>
                  {name}
                </MenuItem>
              ))}
            </Select>

            {!!errors?.categories && (
              <FormHelperText>
                {errors?.categories?.message as string}
              </FormHelperText>
            )}
          </FormControl>

          {/* If there are no categories, show Create Category button */}
          {categoryList.length === 0 && (
            <Box mt={2}>
              <Button
                variant="outlined"
                onClick={() => setOpenCreateCategoryModal(true)}
              >
                Create Category
              </Button>
            </Box>
          )}

          <TextField
            required
            fullWidth
            variant="standard"
            label="Author"
            multiline
            InputLabelProps={{ shrink: true }}
            {...register("author")}
            error={!!errors?.author}
            helperText={(errors?.author?.message as string) || ""}
            sx={{ mt: "16px" }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="standard"
            multiline
            {...register("description")}
            error={!!errors?.description}
            helperText={(errors?.description?.message as string) || ""}
            sx={{ mt: "16px" }}
          />
        </Box>
      </Grid>

      <Grid item lg={5} xs={12}>
        <Typography variant="subtitle2">Thumbnail</Typography>

        {!!errors?.primaryImage && (
          <Typography variant="caption" color="error">
            {errors.primaryImage?.message as string}
          </Typography>
        )}

        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          <Box display="flex" gap={2}>
            <Button
              onClick={() => {
                setOpenPicker(true);
              }}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
            <UploadButton
              onChange={handleFileChange}
              setImage={setImage}
              setValidateFile={setValidateFile}
            />
          </Box>

          {image && (
            <Image
              src={image}
              alt="thumbnail"
              width="190"
              height="190"
              style={{ objectFit: "cover" }}
            />
          )}

          <UnsplashImagePicker
            defaultOpen={openPicker}
            onModalClose={() => setOpenPicker(false)}
            onPhotoSelect={onPhotoSelect}
          />

          {validateFile && (
            <Typography variant="caption" color="error">
              {validateFile}
            </Typography>
          )}
        </Box>
      </Grid>

      {/* Modal to create category */}
      <Modal
        open={openCreateCategoryModal}
        onClose={() => setOpenCreateCategoryModal(false)}
        aria-labelledby="create-category-modal"
        aria-describedby="create-category-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <CreateCategoryForm />
        </Box>
      </Modal>
    </Grid>
  );
};

export default CreatePodcastForm;
