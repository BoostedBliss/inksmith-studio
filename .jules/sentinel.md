## 2025-03-08 - [Express.js Basic Security Hardening]
**Vulnerability:** Express.js app missing fundamental security headers, leaking `x-powered-by`, and using an excessively large JSON payload limit (25mb) that could lead to DoS.
**Learning:** Default Express.js configurations lack built-in security protections. Given the constraint of not adding external dependencies like `helmet`, these must be implemented manually via custom middleware.
**Prevention:** Always implement a basic middleware setting `X-Content-Type-Options`, `X-Frame-Options`, and `X-XSS-Protection`. Explicitly disable `x-powered-by` and set strict, minimal payload limits on `express.json()` matching the expected data size.
