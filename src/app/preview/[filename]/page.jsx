"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Component imports
import ThumbnailPreview from "@/utilities/ThumbnailPreview";
import LiveTuner from "@/utilities/LiveTuner";
import ProcessButton from "@/utilities/ProcessButton";
import JobStatus from "@/utilities/JobStatus";

export default function PreviewPage() {
  const { filename } = useParams(); // get filename from the route

  const [imageUrl, setImageUrl] = useState(null); // store thumbnail image URL
  const [threshold, setThreshold] = useState(80); // threshold for binarization
  const [targetColor, setTargetColor] = useState("#ff0000"); // select target color
  const [jobId, setJobId] = useState(null); // track job ID for processing

  const binarizedCanvasRef = useRef(null); // reference to the canvas DOM element
  const originalImageRef = useRef(null); // reference to the original image DOM element

  // Fetch thumbnail when filename changes
  useEffect(() => {
    const getThumbnail = async () => {
      const res = await fetch(`http://localhost:3000/thumbnail/${filename}`);
      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    };

    if (filename) {
      getThumbnail();
    }
  }, [filename]);

  return (
    <div>
        <h1>Preview</h1>
        <p>Video being previewed: <strong>{filename}</strong></p>

        {/* Step 1: Tuning controls go on top */}
        <LiveTuner
            imageUrl={imageUrl}
            canvasRef={binarizedCanvasRef}
            threshold={threshold}
            setThreshold={setThreshold}
            targetColor={targetColor}
            setTargetColor={setTargetColor}
            originalImageRef={originalImageRef}
        />

        {/* Step 2: Image previews side by side */}
        <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
            <ThumbnailPreview
                    imageUrl={imageUrl}
                    originalImageRef={originalImageRef}
            />

            <div>
                <h3>Binarized Preview</h3>
                <canvas
                    ref={binarizedCanvasRef}
                    style={{ border: "1px solid black" }}
                    width={320}
                    height={240}
                />
            </div>
        </div>

        {/* Step 3: Button under images */}
        <div style={{ marginTop: "1.5rem" }}>
            <ProcessButton
                filename={filename}
                threshold={threshold}
                targetColor={targetColor}
                onJobStarted={setJobId}
            />
        </div>

        {/* Step 4: Job status under the button */}
        <div style={{ marginTop: "1rem" }}>
            {jobId && <JobStatus jobId={jobId} />}
        </div>
  </div>
  );
}
