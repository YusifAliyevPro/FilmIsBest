import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/(.*)",
    "/movies",
    "/movies/(.*)",
    "/movie/(.*)",
    "/movie",
    "/reqsign-in",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};