import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "az"],
  defaultLocale: "az",
  localeDetection: true,
  localePrefix: "always",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
