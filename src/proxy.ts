import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    // console.log('called ===>', request.nextUrl.pathname);
    // console.log('url ===>', request.url);


    return NextResponse.next();
}



export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
}



// import { cookies } from 'next/headers'
// import { NextRequest, NextResponse } from 'next/server'
// import { verifyAccessToken } from './lib/cookie'

// // 1. Specify protected and public routes
// const protectedRoutes = ['/dashboard']
// const publicRoutes = ['/login', '/register']

// export default async function proxy(req: NextRequest) {
//     // console.log('called ===>', req.nextUrl.pathname);
//     // console.log('url ===>', req.url);

//     // 2. Check if the current route is protected or public
//     const path = req.nextUrl.pathname
//     const isProtectedRoute = protectedRoutes.includes(path)
//     const isPublicRoute = publicRoutes.includes(path)

//     // 3. Decrypt the session from the cookie
//     const cookie = (await cookies()).get('accessToken')?.value
//     const session = await verifyAccessToken(cookie as string)
//     // const session = await decrypt(cookie)

//     // 4. Redirect to /login if the user is not authenticated
//     if (isProtectedRoute && !session.payload?.userId) {
//         return NextResponse.redirect(new URL('/login', req.nextUrl))
//     }

//     // 5. Redirect to /dashboard if the user is authenticated
//     if (
//         isPublicRoute &&
//         session.payload?.userId &&
//         !req.nextUrl.pathname.startsWith('/dashboard')
//     ) {
//         return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
//     }

//     return NextResponse.next()
// }

// // Routes Proxy should not run on
// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }