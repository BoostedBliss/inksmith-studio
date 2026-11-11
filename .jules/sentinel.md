## 2025-03-09 - [Info Leak]
**Vulnerability:** Express API endpoints in server.ts were directly returning internal `error.message` strings to the client in HTTP 500 responses.
**Learning:** Returning `error.message` directly can leak sensitive information like system paths or API context from underlying libraries.
**Prevention:** Always log full errors server-side and return generic, safe messages (e.g. "An internal error occurred") to clients.
## 2026-11-09 - [Express Hardening]
**Vulnerability:** Express app was leaking framework info via `x-powered-by`, missing fundamental security headers (like HSTS, X-Content-Type-Options), and lacked payload limits on `express.json()` allowing potential DoS.
**Learning:** By default, Express reveals its identity and offers no protection against basic MIME-sniffing or framing attacks. Further, unlimited JSON parsing enables resource exhaustion.
**Prevention:** Always manually configure fundamental security headers and disable framework identification (e.g. `app.disable('x-powered-by')`). Ensure all body parsers have strictly defined size limits (e.g. `{ limit: '2mb' }`) based on actual API needs.
