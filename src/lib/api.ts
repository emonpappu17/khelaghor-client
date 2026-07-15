import "server-only"

import type { ApiResponse } from "@/types/api.types"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:5000/api/v1"

export interface FetchOptions
  extends Omit<RequestInit, "body"> {
  body?:
  | Record<string, unknown>
  | FormData
  | URLSearchParams
  | BodyInit
  | null

  accessToken?: string
}

function buildHeaders(
  body: FetchOptions["body"],
  extra?: HeadersInit,
  accessToken?: string
) {
  const headers = new Headers(extra)

  const isJson =
    body &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    typeof body === "object"

  if (isJson) {
    headers.set(
      "Content-Type",
      "application/json"
    )
  }

  if (accessToken) {
    headers.set(
      "Cookie",
      `accessToken=${accessToken}`
    )
  }

  return headers
}

function serializeBody(
  body: FetchOptions["body"]
): BodyInit | undefined {
  if (!body) return

  if (
    body instanceof FormData ||
    body instanceof URLSearchParams
  ) {
    return body
  }

  if (
    typeof body === "object" &&
    !ArrayBuffer.isView(body)
  ) {
    return JSON.stringify(body)
  }

  return body as BodyInit
}

async function request(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    body,
    accessToken,
    headers,
    ...rest
  } = options

  return fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...rest,
      headers: buildHeaders(
        body,
        headers,
        accessToken
      ),
      body: serializeBody(body),
    }
  )
}

export async function parseResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  return response.json()
}

export const apiFetch = {
  get: (
    url: string,
    options?: FetchOptions
  ) =>
    request(url, {
      method: "GET",
      ...options,
    }),

  post: (
    url: string,
    options?: FetchOptions
  ) =>
    request(url, {
      method: "POST",
      cache: "no-store",
      ...options,
    }),

  patch: (
    url: string,
    options?: FetchOptions
  ) =>
    request(url, {
      method: "PATCH",
      cache: "no-store",
      ...options,
    }),

  put: (
    url: string,
    options?: FetchOptions
  ) =>
    request(url, {
      method: "PUT",
      cache: "no-store",
      ...options,
    }),

  delete: (
    url: string,
    options?: FetchOptions
  ) =>
    request(url, {
      method: "DELETE",
      cache: "no-store",
      ...options,
    }),
}