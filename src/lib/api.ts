const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const TOKEN_KEY = "sahaay_session_token";

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

const buildUrl = (path: string) => {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  // Add Authorization header if token exists (for production cross-origin)
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  
  return headers;
};

export const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    credentials: "include", // Still include cookies for backward compatibility
    headers: {
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const err: ApiError = new Error("API request failed");
    err.status = response.status;
    try {
      err.details = await response.json();
    } catch {
      err.details = undefined;
    }
    throw err;
  }

  return response.json() as Promise<T>;
};
