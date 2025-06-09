"use client"; 

import { useParams } from "next/navigation"; // for dynamic route params like filename
import { useEffect, useRef, useState } from "react";

export default function PreviewPage() {
  const { filename } = useParams(); // get filename from the route
  const [imageUrl, setImageUrl] = useState(null); // store thumbnail image URL
  const [threshold, setThreshold] = useState(80); // color similarity threshold for binarization
  const [targetColor, setTargetColor] = useState("#ff0000"); // select target color

  const canvasRef = useRef(null); // reference to the canvas DOM element
  const previewRef = useRef(null); // reference to the original image DOM element (new)
  const previewWidth = 320; // width for preview
  const previewHeight = 240; // height for preview

  // fetch thumbnail when filename changes
  useEffect(() => {
    if (filename) {
      fetchThumbnail();
    }
  }, [filename]);

  // process image whenever it's loaded or threshold/color changes
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => drawBinarized(img);
      img.src = imageUrl;
    }
  }, [imageUrl, threshold, targetColor]);

  // fetch the video thumbnail from server
  const fetchThumbnail = async () => {
    const res = await fetch(`/thumbnail/${filename}`);
    const blob = await res.blob();
    setImageUrl(URL.createObjectURL(blob));
  };

  // convert a hex color string to an RGB object
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  // calculate Euclidean distance between two RGB colors
  const colorDistance = (r1, g1, b1, r2, g2, b2) => {
    return Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
    );
  };

  const drawBinarized = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = previewWidth;
    canvas.height = previewHeight;

    // draw the original image into the canvas
    ctx.drawImage(img, 0, 0, previewWidth, previewHeight);

    const imageData = ctx.getImageData(0, 0, previewWidth, previewHeight);
    const { data, width, height } = imageData;

    const binary = []; // 2D binary matrix (1 = match, 0 = no match)
    const visited = Array.from({ length: height }, () => Array(width).fill(false));
    let maxGroup = []; // store the largest group of matching pixels

    const target = hexToRgb(targetColor); // convert hex to RGB for comparison

    // convert image to binary based on color match
    for (let y = 0; y < height; y++) {
      binary[y] = [];
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const dist = colorDistance(r, g, b, target.r, target.g, target.b);

        const val = dist <= threshold ? 1 : 0;
        binary[y][x] = val;

        const color = val ? 255 : 0;
        data[idx] = data[idx + 1] = data[idx + 2] = color; // Set to white or black
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // directions for DFS (up, down, left, right)
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    // find connected components using DFS
    const dfs = (y, x, group) => {
      const stack = [[y, x]];
      while (stack.length > 0) {
        const [cy, cx] = stack.pop();
        if (
          cy < 0 || cy >= height || cx < 0 || cx >= width ||
          visited[cy][cx] || binary[cy][cx] === 0
        ) continue;

        visited[cy][cx] = true;
        group.push([cy, cx]);
        for (const [dy, dx] of directions) {
          stack.push([cy + dy, cx + dx]);
        }
      }
    };

    // find the largest group of white pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (binary[y][x] === 1 && !visited[y][x]) {
          const group = [];
          dfs(y, x, group);
          if (group.length > maxGroup.length) {
            maxGroup = group;
          }
        }
      }
    }

    // calculate centroid and draw circle on both images
    if (maxGroup.length > 0) {
      let sumX = 0, sumY = 0;
      for (const [y, x] of maxGroup) {
        sumX += x;
        sumY += y;
      }
      const cx = sumX / maxGroup.length;
      const cy = sumY / maxGroup.length;

      // draw a green unfilled circle on the binarized canvas
      ctx.beginPath();
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.stroke();

      // draw the circle on the original image using a separate canvas
      const previewCanvas = document.createElement("canvas");
      const previewCtx = previewCanvas.getContext("2d");
      previewCanvas.width = previewWidth;
      previewCanvas.height = previewHeight;

      // draw original image
      previewCtx.drawImage(img, 0, 0, previewWidth, previewHeight);

      // draw green circle
      previewCtx.beginPath();
      previewCtx.strokeStyle = "lime";
      previewCtx.lineWidth = 2;
      previewCtx.arc(cx, cy, 6, 0, 2 * Math.PI);
      previewCtx.stroke();

      // replace the preview image with the canvas data
      if (previewRef.current) {
        previewRef.current.src = previewCanvas.toDataURL();
      }
    }
  };

  return (
    <div>
      <h1>Preview</h1>
      <p>Video being previewed: {filename}</p>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "1rem" }}>
          Color Match Tolerance: {threshold}
          <input
            type="range"
            min="0"
            max="255"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <label>
          Target Color:
          <input
            type="color"
            value={targetColor}
            onChange={(e) => setTargetColor(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      {imageUrl ? (
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            <h3>Original Frame</h3>
            <img
              ref={previewRef} 
              src={imageUrl}
              alt="Thumbnail"
              width={previewWidth}
              height={previewHeight}
            />
          </div>
          <div>
            <h3>Binarized Preview</h3>
            <canvas
              ref={canvasRef}
              style={{ border: "1px solid black" }}
              width={previewWidth}
              height={previewHeight}
            />
          </div>
        </div>
      ) : (
        <p>Loading thumbnail...</p>
      )}
    </div>
  );
}
