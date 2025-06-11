"use client";

import Link from "next/link";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/styles/theme";

import "@/styles/global.css";

export default function ClientsideLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <nav className="navbar">
          <Link href="/" className="nav-link" data-testid="nav-home">Home</Link>
          <Link href="/videos" className="nav-link" data-testid="nav-videos">Videos</Link>
          <Link href="/jobs" className="nav-link" data-testid="nav-jobs">Jobs</Link>
        </nav>
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
}