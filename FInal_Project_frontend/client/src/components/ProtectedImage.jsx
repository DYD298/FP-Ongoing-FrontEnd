import React, { useEffect, useState } from "react";

const DEFAULT_FALLBACK = "https://placehold.co/800x500?text=Image+Unavailable";

const ProtectedImage = ({
  imageUrl,
  token,
  alt = "Image",
  fallbackSrc = DEFAULT_FALLBACK,
  loading = "lazy",
  onError,
  ...imgProps
}) => {
  const [src, setSrc] = useState(fallbackSrc);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl;

    const loadImage = async () => {
      if (!imageUrl) {
        setSrc(fallbackSrc);
        return;
      }

      const isProtectedAdsImage = imageUrl.includes("/ads/image/");

      if (!isProtectedAdsImage) {
        setSrc(imageUrl);
        return;
      }

      if (!token) {
        // If the image endpoint is public, a direct URL works for guest users.
        setSrc(imageUrl);
        return;
      }

      try {
        const response = await fetch(imageUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Image fetch failed: ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
        setSrc(fallbackSrc);
      }
    };

    loadImage();

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fallbackSrc, imageUrl, token]);

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={(event) => {
        if (event.currentTarget.src !== fallbackSrc) {
          event.currentTarget.src = fallbackSrc;
        }
        if (onError) {
          onError(event);
        }
      }}
      {...imgProps}
    />
  );
};

export default ProtectedImage;
