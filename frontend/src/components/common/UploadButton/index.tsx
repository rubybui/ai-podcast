import { AppConfig } from "@/config";
import { UploadFile } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useRef, useState } from "react";
import Image from "next/image";

const fileSize = 1024 * 1024 * 1; // 1MB

interface Props {
  onChange: (fileName: string) => void;
  setImage: (src: string) => void;
  setValidateFile: (str: string) => void;
}

const UploadButton = ({ onChange, setImage, setValidateFile }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    inputRef?.current?.click();
    setImage("");
    setValidateFile("");
    onChange("");
  };

  const uploadFile = async (file: File) => {
    if (file.size > fileSize) {
      setValidateFile("File size is too large");
      return;
    }
    setValidateFile("");

    const formData = new FormData();
    formData.append("image", file, file.name);
    const response = await fetch(`${AppConfig.apiUrl}/upload`, {
      method: "POST",
      body: formData
    });
    const json = await response.json();
    if (json && json.data) {
      const url = `${AppConfig.imageUrl}${json.data}`;
      setImage(url);
      onChange(json.data);
    }
  };

  const selectFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <Box>
      <Button startIcon={<UploadFile />} onClick={handleSelectFile}>
        Upload
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={selectFile}
        />
      </Button>
    </Box>
  );
};

export default UploadButton;
