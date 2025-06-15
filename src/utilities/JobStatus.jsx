"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Link,
  Paper,
} from "@mui/material";

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
    <Paper
      elevation={4}
      sx={{
        marginTop: 3,
        padding: 3,
        borderRadius: 3,
        backgroundColor: "background.paper",
        color: "text.primary",
        minHeight: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      {status === "processing" && (
        <Typography variant="body1" sx={{ color: "primary.main", fontWeight: 500 }}>
          Processing your request...
        </Typography>
      )}

      {status === "done" && csvUrl && (
        <>
          <Typography variant="body1" sx={{ color: "secondary.main", fontWeight: 500 }}>
            Done! Your results are ready.
          </Typography>
          <Link
            href={csvUrl}
            download
            underline="hover"
            color="primary"
            data-testid="job-download-link"
            sx={{ fontSize: "1rem", marginTop: 0.5 }}
          >
            Click here to download result.csv
          </Link>
        </>
      )}

      {status === "error" && (
        <Typography variant="body1" sx={{ color: "error.main", fontWeight: 500 }}>
          Error: {error}
        </Typography>
      )}
    </Paper>
  );
}

