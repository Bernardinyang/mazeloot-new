# Test Suite

This directory contains comprehensive tests for the Mazeloot frontend application.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.ts              # Test environment setup
├── api/                  # API composable tests
│   ├── auth.test.ts
│   └── client.test.ts
├── composables/          # Composable tests
│   ├── useForm.test.ts
│   └── usePagination.test.ts
├── stores/               # Pinia store tests
│   ├── user.test.ts
│   ├── gallery.test.ts
│   └── watermark.test.ts
└── utils/                # Utility function tests
    ├── errors.test.ts
    ├── storage.test.ts
    ├── debounce.test.ts
    └── throttle.test.ts
```

## Test Coverage

- ✅ Error handling utilities
- ✅ Storage utilities (localStorage)
- ✅ Debounce and throttle utilities
- ✅ Form composable (useForm)
- ✅ Pagination composable (usePagination)
- ✅ API client with interceptors
- ✅ Auth API composable
- ✅ User store
- ✅ Gallery store
- ✅ Watermark store

## Writing New Tests

When adding new features, ensure you:

1. Write tests for new utilities in `tests/utils/`
2. Write tests for new composables in `tests/composables/`
3. Write tests for new stores in `tests/stores/`
4. Write tests for new API composables in `tests/api/`

Follow the existing test patterns and use Vitest's testing utilities.
