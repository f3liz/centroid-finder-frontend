// Global API URL for all frontend fetch requests
// Falls back to localhost during local development

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";