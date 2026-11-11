## 2026-11-08 - Added Security Headers Middleware Manually
**Vulnerability:** Missing security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection) and exposed `X-Powered-By: Express` header, making the server more susceptible to MIME-sniffing, clickjacking, XSS, and information disclosure.
**Learning:** These headers were missing because Express doesn't include them by default and the standard solution `helmet` is an external dependency that wasn't authorized.
**Prevention:** Always implement basic security headers via custom middleware if external dependencies like `helmet` are not explicitly allowed.
