/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { UserRole } from "@/types/api.types";
import jwt from "jsonwebtoken";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser"

export type TJwtPayload = {
    userId: string;
    email: string;
    role: UserRole;
};

export const setCookie = async (key: string, value: string, options: Partial<ResponseCookie>) => {
    const cookieStore = await cookies();
    cookieStore.set(key, value, options)
}

export const getCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value || null
}

export const getAccessToken = async () => {
    return await getCookie('accessToken') as string;
}

export const deleteCookie = async (key: string) => {
    const cookieStore = await cookies();
    cookieStore.delete(key)
}

export const verifyTokenUser = async () => {
    try {
        const token = await getCookie('accessToken');

        return jwt.verify(
            token as string,
            process.env.JWT_ACCESS_SECRET as string
        ) as TJwtPayload;

    } catch (error: any) {
        // redirect('/login')
        console.log(error);
        return null
    }
}

export async function forwardAuthCookies(
    response: Response
): Promise<void> {
    const cookieStore = await cookies()

    const setCookies =
        typeof response.headers.getSetCookie === "function"
            ? response.headers.getSetCookie()
            : [response.headers.get("set-cookie") ?? ""].filter(Boolean)

    const parsedCookies = setCookieParser.parse(setCookies)

    for (const cookie of parsedCookies) {
        cookieStore.set(cookie.name, cookie.value, {
            httpOnly: cookie.httpOnly,
            secure: cookie.secure,
            path: cookie.path,
            domain: cookie.domain,
            sameSite: cookie.sameSite?.toLowerCase() as
                | "strict"
                | "lax"
                | "none"
                | undefined,
            maxAge: cookie.maxAge,
        })
    }
}