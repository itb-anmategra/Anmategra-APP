import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/"];
const AUTH_ROUTES = ["/authentication"];

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (AUTH_ROUTES.includes(req.nextUrl.pathname) && token) {
        return NextResponse.redirect(new URL(`/${token.role}`, req.url));
    }

    if (req.nextUrl.pathname.startsWith("/admin") && token && token?.role !== "admin") {
        return NextResponse.redirect(new URL(`/${token.role}`, req.url));
    }

    if (req.nextUrl.pathname.startsWith("/lembaga") && token && token?.role !== "lembaga") {
        return NextResponse.redirect(new URL(`/${token.role}`, req.url));
    }

    if (req.nextUrl.pathname.startsWith("/mahasiswa") && token && token?.role !== "mahasiswa") {
        return NextResponse.redirect(new URL(`/${token.role}`, req.url));
    }

    return NextResponse.next();
}

