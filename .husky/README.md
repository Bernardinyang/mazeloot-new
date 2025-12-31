# Frontend Git Hooks

These hooks run frontend tests automatically:

- **pre-commit**: Runs Vitest tests before each commit
- **pre-push**: Runs Vitest tests before each push

## Skipping Tests

To skip tests (use sparingly):

```bash
# Skip pre-commit hook
git commit --no-verify -m "Your message"

# Skip pre-push hook
git push --no-verify
```

## Manual Test Execution

```bash
# Run tests manually
npm test
# or
npm run test:watch  # Watch mode
```

