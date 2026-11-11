## 2025-03-09 - [Info Leak]
**Vulnerability:** Express API endpoints in server.ts were directly returning internal `error.message` strings to the client in HTTP 500 responses.
**Learning:** Returning `error.message` directly can leak sensitive information like system paths or API context from underlying libraries.
**Prevention:** Always log full errors server-side and return generic, safe messages (e.g. "An internal error occurred") to clients.

## 2024-05-24 - [Missing Security Headers and Permissive Payload Limit]
**Vulnerability:** The application was missing basic security headers (like X-Frame-Options, X-Content-Type-Options) and allowed excessively large JSON payloads (25MB), which can lead to DoS attacks.
**Learning:** Even internal or AI-focused tools must have basic Express security hardening. Large payload limits are an easy target for application-layer DoS.
**Prevention:** Always add standard security headers (or use helmet) and enforce strict, reasonable payload size limits on `express.json()`.
