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
            button="true"
            component={Link}
            href={`/preview/${filename}`}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
              marginBottom: 1,
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "#ffe0b2",
              },
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer"
            }}
          >
            <ListItemText
              primary={
                <Typography
                  data-testid="video-link"
                  data-filename={filename}
                  sx={{ color: "#d84315", fontWeight: 500, textDecoration: "none" }}
                >
                  {filename}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
