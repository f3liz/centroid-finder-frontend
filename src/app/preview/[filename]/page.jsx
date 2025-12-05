"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";

// utility imports
import ThumbnailPreview from "@/utilities/ThumbnailPreview";
import LiveTuner from "@/utilities/LiveTuner";
import ProcessButton from "@/utilities/ProcessButton";
import JobStatus from "@/utilities/JobStatus";
import { API_URL } from "@/utilities/api";  // import shared API URL

export default function PreviewPage() {
  const { filename } = useParams(); // get filename from the route

  const [imageUrl, setImageUrl] = useState(null); // store thumbnail image URL
  const [threshold, setThreshold] = useState(80); // threshold for binarization
  const [targetColor, setTargetColor] = useState("#ff0000"); // select target color
  const [jobId, setJobId] = useState(null); // track job ID for processing

  const binarizedCanvasRef = useRef(null); // reference to the canvas DOM element
  const originalImageRef = useRef(null); // reference to the original image DOM element

  // fetch thumbnail when filename changes
  useEffect(() => {
    const getThumbnail = async () => {
      const res = await fetch(`${API_URL}/thumbnail/${filename}`);
      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    };

    if (filename) {
      getThumbnail();
    }
  }, [filename]);

  return (
    <Box
      sx={{
        maxWidth: 900,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: 2,
        paddingRight: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      <h1>Preview</h1>
      <p>Video being previewed: <strong>{filename}</strong></p>

      {/* color selctor and threshold slider goes on top */}
      <LiveTuner
        imageUrl={imageUrl}
        canvasRef={binarizedCanvasRef}
        threshold={threshold}
        setThreshold={setThreshold}
        targetColor={targetColor}
        setTargetColor={setTargetColor}
        originalImageRef={originalImageRef}
      />

      {/* previews side by side */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "1rem",
          width: "100%"
        }}
      >
        {/* original preview */}
        <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2, flex: "1 1 320px", maxWidth: 350 }}>
          <Typography variant="h6" gutterBottom>
            Original Frame
          </Typography>
          <ThumbnailPreview
            imageUrl={imageUrl}
            originalImageRef={originalImageRef}
          />
        </Paper>

        {/* binarized preview */}
        <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2, flex: "1 1 320px", maxWidth: 350 }}>
          <Typography variant="h6" gutterBottom>
            Binarized Preview
          </Typography>
          <canvas
            ref={binarizedCanvasRef}
            width={320}
            height={240}
          />
        </Paper>
      </Box>

      {/* process button under images */}
      <div style={{ marginTop: "1.5rem" }}>
        <ProcessButton
          filename={filename}
          threshold={threshold}
          targetColor={targetColor}
          onJobStarted={setJobId}
        />
      </div>

      {/* job status under the button */}
      <div style={{ marginTop: "1rem" }}>
        {jobId && <JobStatus jobId={jobId} />}
      </div>
    </Box>
  );
}