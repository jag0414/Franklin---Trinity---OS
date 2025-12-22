# Security Configuration Notes

## Content Security Policy (CSP)

The current CSP configuration in `vercel.json` and `netlify.toml` uses some relaxed policies to ensure compatibility with the React application and its dependencies.

### Current Configuration

The CSP allows:
- `'unsafe-inline'` for styles - Required for styled-components and inline styles
- `'unsafe-eval'` for scripts (Vercel only) - May be needed by some build tools

### Improving Security

For production deployment, consider:

1. **Implementing nonces** for inline scripts:
   ```javascript
   // Example with meta tag
   <meta http-equiv="Content-Security-Policy" 
         content="script-src 'self' 'nonce-{random}'">
   ```

2. **Using hashes** for specific inline scripts:
   - Calculate SHA-256 hash of inline scripts
   - Add to CSP: `script-src 'self' 'sha256-{hash}'`

3. **Refactoring inline code**:
   - Move inline scripts to external files
   - Use CSS modules instead of inline styles where possible

4. **Progressive enhancement**:
   - Start with current relaxed policy
   - Monitor CSP violation reports
   - Gradually tighten restrictions

### Testing CSP

1. Enable CSP report-only mode first:
   ```
   Content-Security-Policy-Report-Only: ...
   ```

2. Monitor violations in browser console

3. Use [CSP Evaluator](https://csp-evaluator.withgoogle.com/) to test your policy

### Platform-Specific Notes

**Netlify**: Supports CSP nonces via `_headers` file
**Vercel**: Supports CSP via `vercel.json` headers
**Cloudflare**: Supports CSP via Workers for dynamic nonce generation

## Additional Security Measures

1. **HTTPS Only**: Always use HTTPS in production
2. **HSTS**: Enable HTTP Strict Transport Security
3. **Secure Cookies**: Set secure flag on all cookies
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **CORS**: Configure strict CORS policies
6. **Input Validation**: Validate and sanitize all user inputs
7. **Dependency Scanning**: Regularly scan for vulnerable dependencies

## References

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Quick Reference](https://content-security-policy.com/)
- [Google Web Fundamentals: CSP](https://developers.google.com/web/fundamentals/security/csp)
