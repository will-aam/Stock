import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /inventory-query)
  const { pathname } = request.nextUrl

  // Check if the request is for the app routes (protected area)
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/inventory-query") ||
    pathname.startsWith("/inventory-import") ||
    pathname.startsWith("/item-requisition") ||
    pathname.startsWith("/production-orders") ||
    pathname.startsWith("/settings")
  ) {
    // For now, we'll simulate authentication by checking for a simple cookie
    // In a real app, you would validate a JWT token or session
    const isAuthenticated = request.cookies.get("auth-token")

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
