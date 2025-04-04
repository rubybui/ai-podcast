import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_FALLBACK_SRC = "/img/podcast/microphone.png";

export default function ImageFallback({ src, fallbackSrc, alt, ...rest }: any) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    if (!src) {
      setImgSrc(fallbackSrc || DEFAULT_FALLBACK_SRC);
    }
    setImgSrc(src);
  }, [src, fallbackSrc]);

  const handleErrorImg = () => {
    setImgSrc(fallbackSrc || DEFAULT_FALLBACK_SRC);
  };

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          handleErrorImg();
        }
      }}
      onError={handleErrorImg}
      placeholder="blur"
      blurDataURL="data:image/png;base64,[iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8VQ8AAnkBewKPWHQAAAAASUVORK5CYII=]"
    />
  );
}
