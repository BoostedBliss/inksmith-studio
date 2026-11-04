## 2025-03-09 - [Info Leak]
**Vulnerability:** Express API endpoints in server.ts were directly returning internal `error.message` strings to the client in HTTP 500 responses.
**Learning:** Returning `error.message` directly can leak sensitive information like system paths or API context from underlying libraries.
**Prevention:** Always log full errors server-side and return generic, safe messages (e.g. "An internal error occurred") to clients.

## 2025-03-09 - [Security Headers]
**Vulnerability:** The Express server was lacking essential security headers (like X-Content-Type-Options, X-Frame-Options) and leaking the framework via `x-powered-by`, which exposed the app to MIME sniffing and clickjacking, and aided reconnaissance.
**Learning:** Security headers should be implemented using custom middleware and `app.disable('x-powered-by')` if we want to minimize adding external dependencies like Helmet. Payload size on `express.json` should be explicitly capped based on expected inputs to mitigate DoS.
**Prevention:** In minimal setups without Helmet, always manually configure basic security headers and strictly constrain the JSON payload limits.
