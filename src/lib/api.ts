// import "server-only"
import { ApiResponse } from "@/types/api.types"
import { cookies } from "next/headers"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5000/api/v1"

function buildHeaders(
  body: FetchOptions["body"],
  extraHeaders: HeadersInit | undefined,
  cookieHeader: string | null
): Headers {
  const headers = new Headers(extraHeaders)

  // JSON body detection — skip for FormData (multipart/form-data is auto)
  if (body && !(body instanceof FormData) && typeof body === "object") {
    headers.set("Content-Type", "application/json")
  }

  if (cookieHeader) {
    headers.set("Cookie", cookieHeader)
  }

  return headers
}

function serializeBody(body: FetchOptions["body"]): BodyInit | null | undefined {
  if (body === null || body === undefined) return undefined
  if (body instanceof FormData) return body
  if (typeof body === "object" && !ArrayBuffer.isView(body)) {
    return JSON.stringify(body)
  }
  return body as BodyInit
}

export async function forwardAuthCookies(response: Response): Promise<void> {
  const store = await cookies()

  // getSetCookie() returns each Set-Cookie value as a separate string
  const setCookies: string[] =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [response.headers.get("set-cookie") ?? ""].filter(Boolean)

  for (const cookieStr of setCookies) {
    const parts = cookieStr.split(";").map((p) => p.trim())
    const [nameValue] = parts
    const eqIdx = nameValue.indexOf("=")
    if (eqIdx === -1) continue

    const name = nameValue.slice(0, eqIdx)
    const value = nameValue.slice(eqIdx + 1)

    const opts: Parameters<typeof store.set>[2] = {}

    for (const part of parts.slice(1)) {
      const lower = part.toLowerCase()
      if (lower === "httponly") opts.httpOnly = true
      else if (lower === "secure") opts.secure = true
      else if (lower.startsWith("samesite="))
        opts.sameSite = part.split("=")[1].toLowerCase() as "strict" | "lax" | "none"
      else if (lower.startsWith("max-age="))
        opts.maxAge = parseInt(part.split("=")[1], 10)
      else if (lower.startsWith("path=")) opts.path = part.split("=")[1]
      else if (lower.startsWith("domain=")) opts.domain = part.split("=")[1]
    }

    store.set(name, value, opts)
  }
}

export function mapApiErrors(
  json: ApiResponse,
  allowedFields: string[]
): Record<string, string[]> {
  const result: Record<string, string[]> = {}

  for (const err of json.errors ?? []) {
    const key = err.field && allowedFields.includes(err.field) ? err.field : "_form"
    result[key] = [...(result[key] ?? []), err.message]
  }

  if (!Object.keys(result).length) {
    result._form = [json.message ?? "An unexpected error occurred."]
  }

  return result
}

export async function parseResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  return response.json()
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?:
  | Record<string, unknown>
  | FormData
  | URLSearchParams
  | BodyInit
  | null

  revalidate?: number | false
  tags?: string[]
}

const serverFetchHelper = async (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
  const { body, headers: extraHeaders, revalidate, tags, ...restOptions } = options;

  const store = await cookies()
  const cookieHeader = store.toString()

  const headers = buildHeaders(body, extraHeaders, cookieHeader)

  const nextOptions: NextFetchRequestConfig = {};

  if (revalidate !== undefined) {
    nextOptions.revalidate = revalidate;
  }

  if (tags && tags.length > 0) {
    nextOptions.tags = tags;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    next: nextOptions,
    body: serializeBody(body),
    ...restOptions,
  });

  return response;
}

export const apiFetch = {
  get: async (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
    return serverFetchHelper(endpoint, {
      method: "GET",
      ...options,
    });
  },

  post: async (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
    return serverFetchHelper(endpoint, {
      method: "POST",
      cache: "no-store", // Mutations should never cache
      ...options,
    });
  },

  put: async (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
    return serverFetchHelper(endpoint, {
      method: "PUT",
      cache: "no-store",
      ...options,
    });
  },

  patch: async (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
    return serverFetchHelper(endpoint, {
      method: "PATCH",
      cache: "no-store",
      ...options,
    });
  },

  delete: async (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
    return serverFetchHelper(endpoint, {
      method: "DELETE",
      cache: "no-store",
      ...options,
    });
  },
};

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};