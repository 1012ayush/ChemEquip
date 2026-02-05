// If we are on Render, use the VITE_API_URL. 
// If we are local, use an empty string so the vite.config.ts proxy handles it.
export const API_BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL 
  : ""; 

console.log("Connecting to API at:", API_BASE_URL || "Local Proxy");