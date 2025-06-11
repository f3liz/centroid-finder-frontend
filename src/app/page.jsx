"use client";

import { Typography } from "@mui/material";

export default function Home() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to the Salamander Home Page
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Process videos, check job statuses, or download csv files.
      </Typography>
    </div>
  );
}