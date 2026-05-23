/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { UserRole } from "@/types/api.types";
import jwt from "jsonwebtoken";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

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

export const deleteCookie = async (key: string) => {
    const cookieStore = await cookies();
    cookieStore.delete(key)
}

// export const verifyAccessToken = async (token: string) => {
//     try {
//         const verifyAccessToken = jwt.verify(
//             token,
//             process.env.JWT_ACCESS_SECRET as string
//         ) as jwt.JwtPayload;

//         return {
//             success: true,
//             message: "Access token verified",
//             payload: verifyAccessToken as TJwtPayload
//         };;
//     } catch (error: any) {
//         // redirect('/login')
//         // return {
//         //     success: false,
//         //     message: error?.message || "Invalid access token",
//         // }
//         console.log(error);
//         return null
//     }
// }

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