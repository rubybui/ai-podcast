import { Box } from "@mui/material";

import { ICategory, IPodcast } from "@/types";
import useResponsive from "@/utils/useResponsive";
import Card from "@/components/common/Card";

interface Props {
  cards?: IPodcast[] | ICategory[];
}

const CardGrid = ({ cards }: Props) => {
  const responsive = useResponsive();

  return (
    <Box>
      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          lg: "repeat(7,minmax(0,1fr))",
          md: "repeat(5,minmax(0,1fr))",
          sm: "repeat(4,minmax(0,1fr))",
          xs: "repeat(2,minmax(0,1fr))",
        }}
      >
        {cards?.map((cards) => (
          <Box
            key={cards._id}
            flexGrow={0}
            flexShrink={1}
            flexBasis={responsive.size.card}
          >
            <Card card={cards} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CardGrid;
