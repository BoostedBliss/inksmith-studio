## 2025-03-09 - [Info Leak]
**Vulnerability:** Express API endpoints in server.ts were directly returning internal `error.message` strings to the client in HTTP 500 responses.
**Learning:** Returning `error.message` directly can leak sensitive information like system paths or API context from underlying libraries.
**Prevention:** Always log full errors server-side and return generic, safe messages (e.g. "An internal error occurred") to clients.

## 2025-03-09 - [Express Application Hardening]
**Vulnerability:** Missing basic security headers and overly large JSON payload limit (25mb) exposed the app to XSS, MIME sniffing, Clickjacking, and DoS attacks.
**Learning:** Even without helmet, Express apps need manual header configuration and strict payload limits to ensure defense in depth.
**Prevention:** Always set X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, disable x-powered-by, and enforce strict payload limits on express.json().
