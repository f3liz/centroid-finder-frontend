"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/utilities/api";  // import shared API URL

// Custom hook to fetch job data
export default function FetchJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Creating loading state for initial fetch
  const [error, setError] = useState(null);     // Creating error state if fetch fails

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/jobs`); // Call backend /jobs route
        const data = await res.json();              // Parse returned JSON
        setJobs(data);                              // Store data in jobs state
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchJobs();
  }, []);

  return { jobs, loading, error };
}