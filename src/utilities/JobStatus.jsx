"use client";

import { useEffect, useState } from "react";

export default function JobStatus({ jobId }) {
  const [status, setStatus] = useState("processing");
  const [csvUrl, setCsvUrl] = useState(null);
  const [error, setError] = useState(null);

  // to check job status
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3000/process/${jobId}/status`);
        const data = await res.json();

        if (res.ok) {
          if (data.status === "done") {
            setStatus("done");
            setCsvUrl(`http://localhost:3000${data.result}`); // result path to the CSV
            clearInterval(interval);
          } else if (data.status === "error") {
            setStatus("error");
            setError(data.error || "Unknown error occurred.");
            clearInterval(interval);
          }
        } else {
          setStatus("error");
          setError("Job not found");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        setStatus("error");
        setError("Error fetching job status");
        clearInterval(interval);
      }
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div>
      {status === "processing" && <p style={{ color: "orange" }}>Processing...</p>}
      {status === "done" && csvUrl && (
        <p style={{ color: "green" }}>Done! <a href={csvUrl} download>Download result.csv</a></p>
      )}
      {status === "error" && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}