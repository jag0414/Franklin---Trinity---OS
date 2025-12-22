# Security Best Practices

This document outlines the security measures implemented in Franklin Trinity OS and recommendations for maintaining security in production.

## Implemented Security Features

### 1. Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Token expiration (configurable, default 7 days)
- ✅ Protected routes with authentication middleware
- ✅ Password requirements enforced (min 8 chars, uppercase, lowercase, number)

### 2. Input Validation & Sanitization
- ✅ Express-validator for input validation
- ✅ Email normalization
- ✅ Username format restrictions
- ✅ Request body parsing limits
- ✅ XSS protection via Helmet.js

### 3. Rate Limiting
- ✅ General API: 100 requests per 15 minutes
- ✅ Authentication endpoints: 5 requests per 15 minutes
- ✅ Database operations: 50 requests per 15 minutes

### 4. HTTP Security Headers (Helmet.js)
- ✅ Content Security Policy
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security (HSTS)
- ✅ Referrer-Policy

### 5. CORS Configuration
- ✅ Configured allowed origins
- ✅ Credentials support
- ✅ Environment-specific origins

### 6. Database Security
- ✅ Mongoose connection with error handling
- ✅ Password field excluded from queries by default
- ✅ Input validation before database operations

## Production Security Checklist

### Before Going Live

#### Environment & Configuration
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT secret (64+ random bytes)
- [ ] Configure proper CORS origins (no wildcards)
- [ ] Use environment variables for all secrets
- [ ] Never commit `.env` files
- [ ] Remove or secure development endpoints

#### Database
- [ ] Use strong MongoDB authentication
- [ ] Enable MongoDB encryption at rest
- [ ] Use encrypted connections (TLS/SSL)
- [ ] Implement IP whitelisting
- [ ] Regular database backups
- [ ] Set up database monitoring

#### Server & Network
- [ ] Enable HTTPS/SSL (TLS 1.2+)
- [ ] Configure firewall rules
- [ ] Use reverse proxy (Nginx/Apache)
- [ ] Implement DDoS protection
- [ ] Set up intrusion detection
- [ ] Disable unnecessary services

#### Application
- [ ] Update all dependencies to latest stable versions
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Implement proper error handling (don't leak stack traces)
- [ ] Set up logging and monitoring
- [ ] Implement log rotation
- [ ] Use security linting tools

#### Access Control
- [ ] Use non-root user for application
- [ ] Implement principle of least privilege
- [ ] Secure SSH access (key-based only)
- [ ] Disable password authentication for SSH
- [ ] Set up fail2ban or similar

## Security Recommendations

### 1. Secrets Management

**DO:**
- Use environment variables for secrets
- Rotate secrets regularly
- Use a secrets management service (AWS Secrets Manager, HashiCorp Vault)
- Generate cryptographically secure random secrets

**DON'T:**
- Commit secrets to version control
- Use default or weak secrets
- Share secrets in plain text
- Reuse secrets across environments

**Generate Strong Secrets:**
```bash
# JWT Secret (64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Alternative with openssl
openssl rand -hex 64
```

### 2. Password Security

**Current Implementation:**
- Bcrypt hashing (12 rounds)
- Minimum 8 characters
- Requires uppercase, lowercase, and number

**Additional Recommendations:**
- Consider increasing bcrypt rounds to 14 for higher security
- Implement password history (prevent reuse)
- Add password strength meter on frontend
- Consider implementing 2FA/MFA
- Implement account lockout after failed attempts

### 3. API Security

**Rate Limiting:**
Current implementation is good. Consider:
- Adjusting limits based on actual usage patterns
- Implementing adaptive rate limiting
- Using Redis for distributed rate limiting in multi-instance setups

**API Keys:**
For machine-to-machine communication:
- Implement API key authentication
- Rotate API keys regularly
- Monitor API key usage

### 4. Monitoring & Logging

**Implement:**
- Centralized logging (ELK stack, Splunk, CloudWatch)
- Real-time alerting for suspicious activities
- Security event monitoring (failed logins, rate limit hits)
- Performance monitoring (APM tools)

**Log Security Events:**
- Failed authentication attempts
- Rate limit violations
- Unauthorized access attempts
- Database errors
- Application crashes

**Don't Log:**
- Passwords or tokens
- Full credit card numbers
- Personal identification numbers
- Full API keys

### 5. Database Security

**MongoDB Best Practices:**
- Enable authentication
- Use role-based access control
- Enable audit logging
- Use encryption at rest
- Use TLS/SSL for connections
- Regular backups with encryption
- Implement data retention policies

**Connection String Security:**
```javascript
// Good - with authentication
mongodb://username:password@host:port/database?authSource=admin&tls=true

// Bad - no authentication
mongodb://localhost:27017/database
```

### 6. HTTPS/TLS Configuration

**Minimum Requirements:**
- TLS 1.2 or higher
- Strong cipher suites
- HSTS enabled
- Certificate from trusted CA
- Regular certificate renewal

**Nginx SSL Configuration Example:**
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 7. Dependency Management

**Regular Maintenance:**
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated

# Update packages
npm update
```

**Best Practices:**
- Run `npm audit` before every deployment
- Subscribe to security advisories
- Use Dependabot or Snyk for automated updates
- Test updates in staging before production
- Maintain a record of dependencies

### 8. Error Handling

**DO:**
- Log errors server-side with full details
- Return generic error messages to clients
- Implement global error handler
- Use appropriate HTTP status codes

**DON'T:**
- Expose stack traces to clients
- Reveal internal implementation details
- Log sensitive data in error messages

**Example:**
```javascript
// Good
res.status(500).json({
  success: false,
  error: 'Internal server error'
});

// Bad
res.status(500).json({
  success: false,
  error: error.stack,
  query: sqlQuery,
  database: dbConnection
});
```

### 9. CORS Configuration

**Production Settings:**
```javascript
// Specific origins only
app.use(cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Avoid:**
- `origin: '*'` in production
- Allowing all methods
- Allowing credentials with wildcard origins

### 10. Security Headers

Already implemented via Helmet.js. Additional considerations:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## Incident Response Plan

### If a Security Breach Occurs:

1. **Immediate Actions:**
   - Identify and isolate affected systems
   - Revoke compromised credentials
   - Block suspicious IP addresses
   - Enable enhanced logging

2. **Investigation:**
   - Review logs for breach timeline
   - Identify scope of compromise
   - Document all findings

3. **Remediation:**
   - Patch vulnerabilities
   - Rotate all secrets
   - Update security measures
   - Notify affected users (if required)

4. **Post-Incident:**
   - Conduct security review
   - Update security procedures
   - Implement additional controls
   - Train team on lessons learned

## Security Testing

### Regular Testing:
- [ ] Run vulnerability scans
- [ ] Perform penetration testing
- [ ] Test authentication flows
- [ ] Verify rate limiting
- [ ] Test input validation
- [ ] Review access controls

### Tools:
- OWASP ZAP for web application scanning
- npm audit for dependency scanning
- Snyk for continuous monitoring
- Burp Suite for manual testing

## Compliance Considerations

Depending on your use case, you may need to comply with:
- **GDPR** (EU data protection)
- **CCPA** (California privacy)
- **HIPAA** (Healthcare data - US)
- **PCI DSS** (Payment card data)
- **SOC 2** (Service organization controls)

Ensure you understand and implement required controls for your industry.

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Contact

For security concerns or to report vulnerabilities:
- Open a security advisory on GitHub (recommended)
- Email: security@yourdomain.com (update with actual security contact)

**Please report security issues responsibly and allow time for fixes before public disclosure.**
