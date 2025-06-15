"use client";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link
} from "@mui/material";

// custom hook for logic
import FetchJobs from "@/utilities/FetchJobs";

// Helper to capitalize first letter of job status like "Done" instead of "done"
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default function Jobs() {
  const { jobs, loading, error } = FetchJobs(); // logic from utilities

  // While jobs are still loading
  if (loading) {
    return (
      <Typography sx={{ textAlign: "center", marginTop: "2rem" }}>
        Loading jobs...
      </Typography>
    );
  }

  // If there was an error fetching jobs
  if (error) {
    return (
      <Typography sx={{ color: "error.main", textAlign: "center", marginTop: "2rem" }}>
        {error}
      </Typography>
    );
  }

  // Main job table render
  return (
    <Box
      sx={{
        maxWidth: "1000px",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "2rem",
        paddingLeft: "1rem",
        paddingRight: "1rem"
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: "1.5rem",
          color: "primary.main",
          textAlign: "center"
        }}
      >
        Job Page
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "16px",
          border: "1px solid black", // black border around table
          overflow: "hidden"
        }}
      >
        <Table
          sx={{
            borderCollapse: "separate",
            borderSpacing: "0 0"
          }}
        >
          <TableHead
            sx={{
              backgroundColor: "#ffe0b2"
            }}
          >
            <TableRow
              sx={{
                borderBottom: "2px solid black" // a black line below the header
              }}
            >
              <TableCell sx={{ borderRight: "1px solid black" }}>
                <strong>Job ID</strong>
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid black" }}>
                <strong>Video</strong>
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid black" }}>
                <strong>Color</strong>
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid black" }}>
                <strong>Threshold</strong>
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid black" }}>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Result</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job, index) => (
              <TableRow
                key={job.jobId}
                data-testid="job-row"
                sx={{
                  backgroundColor: index % 2 === 0 ? "background.default" : "#fffaf0",
                  borderBottom: "1px solid black", // a black line between rows
                }}
              >
                <TableCell sx={{ borderRight: "1px solid black" }} data-testid="job-id">
                  {job.jobId}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid black" }} data-testid="job-video">
                  {job.videoFileName}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid black" }} data-testid="job-color">
                  {job.targetColor}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid black" }} data-testid="job-threshold">
                  {job.threshold}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid black" }} data-testid="job-status">
                  {capitalize(job.status)}
                </TableCell>
                <TableCell>
                  {job.status === "done" ? (
                    <Link
                      data-testid="job-download-link"
                      href={`http://localhost:3000/results/${job.outputFileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      color="primary"
                    >
                      Download CSV
                    </Link>
                  ) : (
                    <Typography data-testid="job-no-download" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}