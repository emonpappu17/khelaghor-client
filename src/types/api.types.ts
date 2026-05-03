export type UserRole = "USER" | "HOST" | "ADMIN" | "SUPER_ADMIN"
export type UserStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED" | "INACTIVE"

export type HostProfile = {
  id: string
  businessName: string
  nidNumber?: string
  isApproved: boolean
  approvedAt: string | null
}

export type User = {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  role: UserRole
  status: UserStatus
  isVerified: boolean
  isDeleted: boolean
  createdAt: string
  hostProfile?: HostProfile
}

export type ActionState<TData = undefined> = {
  success?: boolean
  message?: string
  data?: TData
  errors?: {
    _form?: string[]
    [field: string]: string[] | undefined
  }
  fields?: Record<string, string>
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
}


export type ApiError = {
  field?: string
  message: string
}


export type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  meta?: PaginationMeta
  errors?: ApiError[]
}


export type AuthUser = Pick<User, "id" | "name" | "email" | "role" | "avatar">


export type LoginData = {
  accessToken: string
  user: AuthUser
}