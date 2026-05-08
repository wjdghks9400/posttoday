import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin/login")) {
        return NextResponse.next();
    }

    const adminCookie = request.cookies.get("posttoday_admin");

    if (adminCookie?.value === "ok") {
        return NextResponse.next();
    }

    const loginUrl = new URL("/admin/login", request.url);

    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/admin/:path*"],
};