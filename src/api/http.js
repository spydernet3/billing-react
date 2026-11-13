export const TOKEN_STORAGE_KEY = 'edabip_access_token';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(
  /\/+$/,
  ''
);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest(path, { method = 'GET', body, auth = true, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (body !== undefined && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      throw new ApiError('Your session has expired. Please sign in again.', 401);
    }
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method,
      headers,
      body:
        body === undefined || body instanceof FormData || typeof body === 'string'
          ? body
          : JSON.stringify(body),
    });
  } catch {
    if (options.signal?.aborted) {
      throw new DOMException('The request was aborted.', 'AbortError');
    }
    throw new ApiError(`Could not connect to the API at ${API_BASE_URL}.`, 0);
  }

  if (response.status === 401 && auth) {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    window.dispatchEvent(new Event('api:unauthorized'));
  }

  if (response.status === 204) {
    return null;
  }

  let envelope;
  try {
    envelope = await response.json();
  } catch {
    throw new ApiError('The API returned an invalid response.', response.status);
  }

  if (!response.ok || envelope?.success === false) {
    throw new ApiError(
      envelope?.error?.message || `Request failed (${response.status}).`,
      response.status
    );
  }

  if (!envelope || !Object.hasOwn(envelope, 'data')) {
    throw new ApiError('The API response is missing its data field.', response.status);
  }

  return envelope.data;
}
