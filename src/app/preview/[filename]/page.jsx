"use client"; 

import { useParams } from "next/navigation"; // for dynamic route params like filename
import { useEffect, useRef, useState } from "react";

export default function PreviewPage() {
  const { filename } = useParams(); // get filename from the route
  const [ imageUrl, setImageUrl ] = useState(null); // store thumbnail image URL
  const [ threshold, setThreshold ] = useState(80); // threshold for binarization
  const [ targetColor, setTargetColor ] = useState("#ff0000"); // select target color

  const binarizedCanvasRef = useRef(null); // reference to the canvas DOM element
  const originalImageRef = useRef(null); // reference to the original image DOM element
  const previewWidth = 320; // width for preview
  const previewHeight = 240; // height for preview

  // fetch thumbnail when filename changes
  useEffect(() => {
    if (filename) {
      getThumbnail();
    }
  }, [filename]);

  // process image whenever it's loaded or threshold/color changes
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => drawBinarizedImage(img);
      img.src = imageUrl;
    }
  }, [imageUrl, threshold, targetColor]);

  // get the video thumbnail from server
  const getThumbnail = async () => {
    const res = await fetch(`http://localhost:3000/thumbnail/${filename}`);
    const blob = await res.blob();
    setImageUrl(URL.createObjectURL(blob));
  };

  // convert a hex color string to RGB object
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      red: (bigint >> 16) & 255,
      green: (bigint >> 8) & 255,
      blue: bigint & 255,
    };
  };

  // calculate euclidean distance between two RGB colors
  const colorDistance = (r1, g1, b1, r2, g2, b2) => {
    return Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
    );
  };

  const drawBinarizedImage = (img) => {
    const canvas = binarizedCanvasRef.current; // grabs canvas element
    const context = canvas.getContext("2d"); // drawing context to be able to draw

    canvas.width = previewWidth;
    canvas.height = previewHeight;

    // draw the original image into the canvas
    context.drawImage(img, 0, 0, previewWidth, previewHeight);

    const imageData = context.getImageData(0, 0, previewWidth, previewHeight);
    const { data, width, height } = imageData;

    const binaryMatrix = []; // 2D binary matrix (1 = match, 0 = no match)
    const visitedPixels = Array.from({ length: height }, () => Array(width).fill(false));
    let largestRegion = []; // store the largest group of matching pixels

    const targetRgb = hexToRgb(targetColor); // convert hex to RGB for comparison

    // convert image to binary based on color match
    for (let y = 0; y < height; y++) {
      binaryMatrix[y] = [];
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        
        const distance = colorDistance(red, green, blue, targetRgb.red, targetRgb.green, targetRgb.blue);

        const val = distance <= threshold ? 1 : 0;
        binaryMatrix[y][x] = val;

        const color = val ? 255 : 0;
        data[index] = data[index + 1] = data[index + 2] = color; // set to white or black
      }
    }

    context.putImageData(imageData, 0, 0);

    // directions for DFS (up, down, left, right)
    const directions = [
      [-1, 0], 
      [1, 0], 
      [0, -1], 
      [0, 1]
    ];

    // find connected components using DFS
    const dfs = (y, x, group) => {
      const stack = [[y, x]];
      while (stack.length > 0) {
        const [currentY, currentX] = stack.pop();
        if (
          currentY < 0 || currentY >= height || currentX < 0 || currentX >= width ||
          visitedPixels[currentY][currentX] || binaryMatrix[currentY][currentX] === 0
        ) continue;

        visitedPixels[currentY][currentX] = true;
        group.push([currentY, currentX]);
        for (const [dy, dx] of directions) {
          stack.push([currentY + dy, currentX + dx]);
        }
      }
    };

    // find the largest group of white pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (binaryMatrix[y][x] === 1 && !visitedPixels[y][x]) {
          const group = [];
          dfs(y, x, group);
          if (group.length > largestRegion.length) {
            largestRegion = group;
          }
        }
      }
    }

    // calculate centroid and draw circle on both images
    if (largestRegion.length > 0) {
      let sumX = 0, sumY = 0;
      for (const [y, x] of largestRegion) {
        sumX += x;
        sumY += y;
      }
      const centroidX = sumX / largestRegion.length;
      const centroidY = sumY / largestRegion.length;

      // draw a green unfilled circle on the binarized canvas
      context.beginPath();
      context.strokeStyle = "lime";
      context.lineWidth = 2;
      context.arc(centroidX, centroidY, 6, 0, 2 * Math.PI);
      context.stroke();

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
      previewCtx.arc(centroidX, centroidY, 6, 0, 2 * Math.PI);
      previewCtx.stroke();

      // replace the preview image with the canvas data
      if (originalImageRef.current) {
        originalImageRef.current.src = previewCanvas.toDataURL();
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
              ref={originalImageRef} 
              src={imageUrl}
              alt="Thumbnail"
              width={previewWidth}
              height={previewHeight}
            />
          </div>
          <div>
            <h3>Binarized Preview</h3>
            <canvas
              ref={binarizedCanvasRef}
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
