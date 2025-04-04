import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Switch,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";

import type { NextPageWithLayout } from "@/pages/_app";

import CreatePodcastForm from "@/components/common/CreatePodcastForm";
import CreatePodcastVariant from "@/components/common/CreatePodcastVariant";
import { AppConfig } from "@/config";
import { ICategory, IAudio, ICreatePodcastFormData } from "@/types";
import { createPodcastValidator } from "@/utils/validator";

interface Props {
  categoryList: ICategory[];
}

export async function getStaticProps() {
  console.log("testing config", AppConfig)
  const response = await fetch(AppConfig.apiUrl + "/categories", {
    method: "GET"
  });

  const json = await response.json();
  const data = json?.data;

  return {
    props: {
      categoryList: data as ICategory[]
    }
  };
}

const CreatePodcastPage: NextPageWithLayout<Props> = ({ categoryList }) => {
  //States
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  //responsive button
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Define create podcast form
  const methods = useForm<ICreatePodcastFormData>({
    defaultValues: {
      name: "",
      description: "",
      author: session?.user?.name || "",
      poster: {
        email: session?.user?.email || "",
        name: session?.user?.name || ""
      },
      categories: [],
      primaryImage: "",
      variants: [
        {
          variantName: "",
          order: 0,
          content: "",
          speed: [1],
          voiceName: "en-US-JasonNeural",
          tone: "newscast"
        }
      ]
    },
    resolver: yupResolver(createPodcastValidator)
  });

  // Handlers
  const createPodcastVariantVersion = async (
    podcastId: string,
    variantId: string,
    version: IAudio
  ) => {
    return await fetch(
      AppConfig.apiUrl +
        `/podcasts/${podcastId}/variants/${variantId}/versions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...version
        })
      }
    ).then((res) => {
      if (!res.ok) {
        throw new Error("Creating podcast version failed");
      }
    });
  };

  const createPodcastVariant = async (podcastId: string, formVariant: any) => {
    return await fetch(AppConfig.apiUrl + `/podcasts/${podcastId}/variants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formVariant.variantName,
        content: formVariant.content,
        order: formVariant.order
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Creating podcast variant failed");
        }
        return res.json();
      })
      .then(async (resVariant) => {
        const versions: IAudio[] = formVariant.speed.map((speed: number) => {
          return {
            speed,
            voiceName: formVariant.voiceName,
            style: formVariant.tone
          };
        });

        const promises = versions.map(async (version) => {
          return await createPodcastVariantVersion(
            podcastId,
            resVariant?.data._id,
            version
          );
        });

        return await Promise.all(promises);
      })
      .catch((error) => {
        throw error;
      });
  };

  const createPodcast = async (formData: any) => {
    if (status !== "authenticated") return <></>;
    try {
      fetch(AppConfig.apiUrl + "/podcasts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          author: formData.author,
          categories: formData.categories,
          primaryImage: formData.primaryImage,
          poster: formData.poster
        })
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Creating podcast failed");
          }
          return res.json();
        })
        .then(async (resPodcast) => {
          if (resPodcast.data) {
            await Promise.all(
              formData.variants.map(async (variant: any) => {
                await createPodcastVariant(resPodcast.data._id, variant);
              })
            );

            setLoading(false);
            router.push(`/podcast/${resPodcast.data.slug}`);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleCreatePodcast = methods.handleSubmit((data) => {
    setLoading(true);
    createPodcast(data);
  });

  const handleCancel = () => {
    router.push("/");
  };

  const variants = methods.watch("variants");

  const handleAddToVariantsList = () => {
    const newVariant = {
      variantName: "",
      order: variants.length,
      content: "",
      speed: [1],
      voiceName: "en-US-JasonNeural",
      tone: "newscast"
    };
    const updatedVariants = [...variants, newVariant];

    methods.setValue("variants", updatedVariants);
  };

  const handleRemoveFromVariantsList = (index: number) => {
    if (index > 0) {
      const updatedVariants = [
        ...variants.splice(0, index),
        ...variants.splice(index + 1)
      ];
      for (let i = 0; i < updatedVariants.length; i++) {
        updatedVariants[i].order = i;
      }
      methods.setValue("variants", updatedVariants);
    }
  };

  return (
    <Box pt="71px">
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight="500">
          Create your own podcast
        </Typography>

        <Box mt={3}>
          <FormProvider {...methods}>
            <CreatePodcastForm categoryList={categoryList} />

            {variants.map((_, index) => (
              <CreatePodcastVariant
                key={index}
                index={index}
                handleRemoveFromVariantsList={handleRemoveFromVariantsList}
              />
            ))}
            <Box
              mt={2}
              display="flex"
              gap={2}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Button
                variant="outlined"
                onClick={handleAddToVariantsList}
                fullWidth
                style={{
                  borderStyle: "dashed",
                  width: isMobile ? "100%" : "50%"
                }}
              >
                Add Chapter
              </Button>
            </Box>
            <Box mt={2} display="flex" gap={2}>
              <Button
                variant="contained"
                disabled={isLoading}
                onClick={handleCreatePodcast}
              >
                {isLoading ? <CircularProgress size={15} /> : "Submit"}
              </Button>
              <Button variant="text" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Container>
    </Box>
  );
};

CreatePodcastPage.auth = true;

export default CreatePodcastPage;
