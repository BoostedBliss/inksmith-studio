## 2025-03-09 - [Info Leak]
**Vulnerability:** Express API endpoints in server.ts were directly returning internal `error.message` strings to the client in HTTP 500 responses.
**Learning:** Returning `error.message` directly can leak sensitive information like system paths or API context from underlying libraries.
**Prevention:** Always log full errors server-side and return generic, safe messages (e.g. "An internal error occurred") to clients.
