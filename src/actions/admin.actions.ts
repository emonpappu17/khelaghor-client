"use server"

import { apiFetch, parseResponse } from "@/lib/api"
import { getAccessToken } from "@/lib/cookie"
import type { ActionState, UserRole, UserStatus } from "@/types/api.types"
import { updateTag } from "next/cache"

export async function updateUserStatusAction(
  userId: string,
  status: UserStatus
): Promise<ActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { errors: { _form: ["Unauthorized: Please log in as an administrator."] } }
  }

  try {
    const response = await apiFetch.patch(`/users/${userId}/status`, {
      body: { status },
      accessToken,
    })

    const res = await parseResponse(response)

    if (!res.success) {
      return { errors: { _form: [res.message ?? "Failed to update user status."] } }
    }

    updateTag("users")

    return { success: true, message: res.message ?? "User status updated successfully!" }
  } catch (error) {
    console.error("updateUserStatusAction error:", error)
    return {
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        ],
      },
    }
  }
}

export async function updateUserRoleAction(
  userId: string,
  role: UserRole
): Promise<ActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { errors: { _form: ["Unauthorized: Please log in as an administrator."] } }
  }

  try {
    const response = await apiFetch.patch(`/users/${userId}/role`, {
      body: { role },
      accessToken,
    })

    const res = await parseResponse(response)

    if (!res.success) {
      return { errors: { _form: [res.message ?? "Failed to update user role."] } }
    }

    updateTag("users")

    return { success: true, message: res.message ?? "User role updated successfully!" }
  } catch (error) {
    console.error("updateUserRoleAction error:", error)
    return {
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        ],
      },
    }
  }
}

export async function deleteUserAction(
  userId: string
): Promise<ActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { errors: { _form: ["Unauthorized: Please log in as an administrator."] } }
  }

  try {
    const response = await apiFetch.delete(`/users/${userId}`, { accessToken })

    const res = await parseResponse(response)

    if (!res.success) {
      return { errors: { _form: [res.message ?? "Failed to delete user."] } }
    }

    updateTag("users")

    return { success: true, message: res.message ?? "User deleted successfully!" }
  } catch (error) {
    console.error("deleteUserAction error:", error)
    return {
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        ],
      },
    }
  }
}

export async function refreshUsersAction(): Promise<void> {
  updateTag("users")
  return
}
