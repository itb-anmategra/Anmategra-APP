import {type NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

const AUTH_ROUTES = ["/authentication"];
const STATIC = ["/_next", "/api", "/images", "/favicon.ico", "/manifest.json", "/robots.txt"];


export default async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (STATIC.some((route) => req.nextUrl.pathname.startsWith(route))) {
        return NextResponse.next();
    }

    if (req.nextUrl.pathname !== "/" && req.nextUrl.pathname !== "/authentication" && !token) {
        return NextResponse.redirect(new URL("/authentication", req.url));
    }

    if (AUTH_ROUTES.includes(req.nextUrl.pathname) && token) {
        if (token.role === "mahasiswa") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.redirect(new URL(`/${token.role}`, req.url));
    }

    if (req.nextUrl.pathname.startsWith("/admin") && token && token?.role !== "admin") {
        if (token.role === "mahasiswa") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.redirect(new URL(`/${token.role}`, req.url));
    }

    if (req.nextUrl.pathname.startsWith("/lembaga") && token && token?.role !== "lembaga") {
        if (token.role === "mahasiswa") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.redirect(new URL(`/${token.role}`, req.url));
    }

    return NextResponse.next();
}

