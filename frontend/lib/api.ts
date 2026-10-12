const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!configuredApiUrl && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_API_URL must be set to the deployed backend URL.");
}

export const API_URL = (configuredApiUrl || "http://localhost:3001").replace(/\/+$/, "");
