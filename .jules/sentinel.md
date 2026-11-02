## 2025-03-09 - [Info Leak]
**Vulnerability:** Express API endpoints in server.ts were directly returning internal `error.message` strings to the client in HTTP 500 responses.
**Learning:** Returning `error.message` directly can leak sensitive information like system paths or API context from underlying libraries.
**Prevention:** Always log full errors server-side and return generic, safe messages (e.g. "An internal error occurred") to clients.

## 2026-11-02 - [Security Headers & DoS]
**Vulnerability:** Express API missing basic security headers (CSP, X-Frame-Options, etc.), exposing framework details via `x-powered-by`, and overly permissive JSON payload limit (25MB).
**Learning:** Default Express configs lack basic security best practices. Relying on defaults leaves the app vulnerable to clickjacking, MIME-sniffing, XSS, framework fingerprinting, and DoS attacks via large payloads. Since adding new dependencies (like `helmet`) requires permission, these headers can be set manually via custom middleware.
**Prevention:** Always implement basic security headers and strict payload limits manually in new Express apps if a security dependency isn't approved. Do not rely on framework defaults.
