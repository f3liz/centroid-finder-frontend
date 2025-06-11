"use client";

import { useEffect, useState } from "react";

export default function Jobs() {
  // State to hold jobs returned from the backend
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Creating loading state for initial fetch
  const [error, setError] = useState(null);     // Creating error state if fetch fails

  // Helper to capitalize first letter of job status like "Done" instead of "done"
  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  // Fetch all job data from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:3000/jobs"); // Call backend /jobs route
        const data = await res.json();                          // Parse returned JSON
        setJobs(data);                                          // Store data in jobs state
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchJobs();
  }, []);

  // While jobs are still loading
  if (loading) return <p>Loading jobs...</p>;

  // If there was an error fetching jobs
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Main job table render — no styling for now as it will be done later with Material UI
  return (
    <div>
      <h2>Job Page</h2>
      <table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Video</th>
            <th>Color</th>
            <th>Threshold</th>
            <th>Status</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.jobId} data-testid="job-row">
              <td data-testid="job-id">{job.jobId}</td>
              <td data-testid="job-video">{job.videoFileName}</td>
              <td data-testid="job-color">{job.targetColor}</td>
              <td data-testid="job-threshold">{job.threshold}</td>
              <td data-testid="job-status">{capitalize(job.status)}</td>
              <td>
                {/* Only show download link if the job is marked done */}
                {job.status === "done" ? (
                  <a
                    data-testid="job-download-link"
                    href={`http://localhost:3000/results/${job.outputFileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download CSV
                  </a>
                ) : (
                  <span data-testid="job-no-download">-</span> // Show dash if the job is still processing or errored
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
