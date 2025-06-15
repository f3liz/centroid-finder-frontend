"use client";

export default function ProcessButton({ filename, threshold, targetColor, onJobStarted }) {
  // Handle the POST request to start processing the video on the backend
  const handleProcess = async () => {
    try {
      // Removing the '#' from the hex color code to use it in the URL
      const hex = targetColor.replace("#", "");

      // Sending the POST request to the backend with the filename, target color, and threshold
      const res = await fetch(`http://localhost:3000/process/${filename}?targetColor=${hex}&threshold=${threshold}`, {
        method: "POST"
      });

      const data = await res.json();

      if (res.ok) {
        // Alert the user that the job has started successfully
        console.log("Started processing with Job ID:", data.jobId);
        onJobStarted(data.jobId);
      } else {
        // Alert the user that the job failed to start processing due to a backend error and log it
        console.error("Failed to start processing:", data.error);
        alert("Failed to start processing job.");
      }
    } catch (err) {
      // Alert the user that there was an error with the request and log it
      console.error("Error making request:", err);
      alert("An error occurred while starting the job.");
    }
  };

  return (
    <button
      onClick={handleProcess}
      style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
    >
      Start Processing
    </button>
  );
}