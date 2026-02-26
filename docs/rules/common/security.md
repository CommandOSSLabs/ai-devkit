# Security

## Secrets and Credentials

- Never commit secrets, tokens, or private keys
- Use environment variables or secret managers for sensitive values

## Input Handling

- Validate and sanitize all untrusted input
- Fail safely on malformed or unexpected input

## Dependency Safety

- Prefer maintained dependencies with clear release history
- Review security advisories before upgrades

## Access and Permissions

- Apply least-privilege access by default
- Keep privileged operations explicit and audited

## Logging

- Do not log credentials or personal sensitive data
- Log security-relevant events with enough context for investigation
