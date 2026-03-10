"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_SRC = "/images/species/harimau-sumatera.jpg";

interface Props extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = FALLBACK_SRC,
  alt,
  ...props
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
