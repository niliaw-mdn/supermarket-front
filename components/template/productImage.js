import React, { useEffect, useState } from "react";

function ImageWithAuth({ imagePath }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          router.push("/");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/uploads/${encodeURI(imagePath)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch image");
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImage();

    // cleanup URL object when component unmounts or imagePath changes
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imagePath]);

  if (!imageUrl) {
    return <p>Loading image...</p>;
  }

  return (
    <img
      src={imageUrl}
      alt="Authorized content"
      className="h-16 w-16 object-cover"
    />
  );
}

export default ImageWithAuth;
