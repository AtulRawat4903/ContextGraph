const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error(
    "Missing environment variable: VITE_API_URL"
  );
}

try {
  new URL(apiUrl);
} catch {
  throw new Error(
    "Invalid environment variable: VITE_API_URL must be a valid URL."
  );
}

export const env = {
  API_URL: apiUrl,
};