## 2025-03-09 - [Info Leak]
**Vulnerability:** Express API endpoints in server.ts were directly returning internal `error.message` strings to the client in HTTP 500 responses.
**Learning:** Returning `error.message` directly can leak sensitive information like system paths or API context from underlying libraries.
**Prevention:** Always log full errors server-side and return generic, safe messages (e.g. "An internal error occurred") to clients.
## 2024-05-18 - [Missing Security Headers and Unrestricted JSON Payload Size]
**Vulnerability:** Express app lacked basic security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection), exposed tech stack via 'x-powered-by', and allowed 25mb JSON payloads.
**Learning:** These were missing likely to speed up initial development. 25MB JSON is extremely large and could lead to DoS via memory exhaustion.
**Prevention:** Always add a middleware to set core security headers and disable 'x-powered-by' by default on Express initialization. Set a stricter limit on `express.json()` matching actual application needs.
