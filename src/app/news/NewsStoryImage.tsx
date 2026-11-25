"use client";

const fallbackImage = "/images/goalqube-stadium.png";

export default function NewsStoryImage({ src, alt }: { src?: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || fallbackImage}
      alt={alt}
      width="640"
      height="360"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={(event) => {
        const image = event.currentTarget;
        if (!image.src.endsWith(fallbackImage)) image.src = fallbackImage;
      }}
    />
  );
}
