"use client";

export default function ThumbnailPreview({ imageUrl, originalImageRef }) {
  return (
    <div>
      {/* only render the image if imageUrl is there */}
      {imageUrl ? (
        <img
          ref={originalImageRef}
          src={imageUrl}
          alt="Thumbnail"
          width={320}
          height={240}
        />
      ) : (
        <p>Loading thumbnail...</p>
      )}
    </div>
  );
}
