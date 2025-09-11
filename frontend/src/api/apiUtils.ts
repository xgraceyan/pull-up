export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  errorMessage?: string
): Promise<T> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "applicaion/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const resErrorMessage = await res.text();
    throw new Error(`${errorMessage}: ${resErrorMessage}`);
  }

  return await res.json();
}
