import { ApiError } from "./errors";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, options);

  if (!response.ok) {
    let data: unknown = null;

    try {
      data = await response.json();
    } catch {
      // The backend may return an empty response.
    }

    throw new ApiError(response.status, data);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
