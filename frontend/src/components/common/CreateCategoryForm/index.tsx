import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AppConfig } from "@/config";

interface CreateCategoryFormValues {
  name: string;
  bannerUrl?: string;
}

const CreateCategoryForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateCategoryFormValues>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: CreateCategoryFormValues) => {
    try {
      const response = await fetch(AppConfig.apiUrl + "/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      alert("Category created successfully!");
      reset();
      setErrorMessage(null);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong");
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="subtitle2" gutterBottom>
        Create New Category
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          required
          fullWidth
          label="Category Name"
          variant="standard"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Banner URL (Optional)"
          variant="standard"
          {...register("bannerUrl")}
          error={!!errors.bannerUrl}
          helperText={errors.bannerUrl?.message}
          sx={{ mb: 2 }}
        />

        {errorMessage && (
          <Typography color="error" variant="caption" sx={{ display: "block", mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </Box>
  );
};

export default CreateCategoryForm;
