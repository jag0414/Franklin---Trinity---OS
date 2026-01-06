# Security Notes

## NPM Security Vulnerabilities

### Current Status (December 2024)

#### esbuild Vulnerability (Moderate Severity)
- **Issue**: esbuild <=0.24.2 enables any website to send any requests to the development server
- **Advisory**: https://github.com/advisories/GHSA-67mh-4wv8-2f99
- **Affected**: Development server only (NOT production builds)
- **Current Version**: esbuild 0.21.5 (via vite 5.4.21)
- **Fix Available**: Yes, via vite 7.3.0 upgrade (breaking change)

#### Decision: Not Upgrading at This Time

**Reasons:**
1. **Development-Only Impact**: This vulnerability only affects the development server, not production builds
2. **Breaking Changes**: Upgrading to vite 7.x would require significant testing and potential code changes
3. **Low Risk in Context**: Development servers should only be run in trusted local environments
4. **Production Builds Are Safe**: The built artifacts (dist/) are not affected by this vulnerability

#### Mitigation Strategies

1. **For Development**:
   - Only run `npm run dev` in trusted local environments
   - Do not expose the development server to untrusted networks
   - Use `npm run build` and `npm run preview` for testing production builds

2. **For Production**:
   - Always use production builds (`npm run build`)
   - The vulnerability does not affect production builds

#### Future Actions

- Monitor for vite 7.x stability and adoption
- Consider upgrading when vite 7.x becomes the standard and breaking changes are acceptable
- Track esbuild security advisories for any critical vulnerabilities

## Python Security

All Python dependencies are up to date with no known security vulnerabilities.

### Database Security
- ✅ Fixed: SQL text expressions now properly wrapped with `text()` function
- ✅ Using parameterized queries via SQLModel/SQLAlchemy
- ✅ Connection pooling with pre-ping enabled

### Authentication Security
- ✅ JWT tokens with HS256 algorithm
- ✅ Secret key configuration via environment variables
- ✅ Token expiration (30 days)

## Backend Security Improvements Applied

1. **Database Connection**: Fixed SQLAlchemy text expression warning
2. **Deprecated APIs**: Migrated from `on_event()` to modern `lifespan` handlers
3. **Build Artifacts**: Removed all committed .pyc, .dll, and .db files
4. **Enhanced .gitignore**: Added better patterns to prevent future commits of build artifacts

---

**Last Updated**: December 30, 2024
**Status**: All critical issues resolved, development-only npm vulnerabilities documented
