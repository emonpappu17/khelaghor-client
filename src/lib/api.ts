import { ApiResponse } from "@/types/api.types"
import { cookies } from "next/headers"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5000/api/v1"

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown> | FormData | BodyInit | null
  withAuth?: boolean
}

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

export async function apiFetch<T = unknown>(
  endpoint: string,
  { body, withAuth = true, headers: extraHeaders, ...rest }: FetchOptions = {}
): Promise<ApiResponse<T>> {
  let cookieHeader: string | null = null

  if (withAuth) {
    const store = await cookies()
    cookieHeader = store.toString()
  }

  const headers = buildHeaders(body, extraHeaders, cookieHeader)

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers,
    body: serializeBody(body),
  })

  const json: ApiResponse<T> = await response
    .json()
    .catch(() => ({ success: false, message: "Failed to parse server response" }))

  return json
}


export function mapApiErrors(
  json: ApiResponse,
  allowedFields: string[]
): Record<string, string[]> {
  const result: Record<string, string[]> = {}

  for (const err of json.errors ?? []) {
    console.log('fist');

    const key = err.field && allowedFields.includes(err.field) ? err.field : "_form"
    result[key] = [...(result[key] ?? []), err.message]
  }

  if (!Object.keys(result).length) {
    console.log('second');
    result._form = [json.message ?? "An unexpected error occurred."]
  }

  return result
}