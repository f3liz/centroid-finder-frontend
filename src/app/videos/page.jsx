"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function VideoChooserPage() {
  // state to hold video filenames
  const [videos, setVideos] = useState([]);

  // fetch videos when component mount
  useEffect(() => {
    getVideos();
  }, []);

  // fetch video list from API get route
  const getVideos = async () => {
    const res = await fetch("http://localhost:3000/api/videos");
    const data = await res.json();
    setVideos(data);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 4 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Available Videos
      </Typography>

      {/* list of video links */}
      <List>
        {videos.map((filename) => (
          <ListItem
            key={filename}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
              mb: 1,
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "#ffe0b2",
              },
            }}
          >
            <ListItemText
              primary={
                <Link
                  data-testid="video-link"
                  data-filename={filename}
                  href={`/preview/${filename}`}
                  style={{
                    textDecoration: "none",
                    color: "#d84315",
                    fontWeight: 500,
                  }}
                >
                  {filename}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
