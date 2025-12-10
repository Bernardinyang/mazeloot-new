# Prettier & Husky Setup

This project uses Prettier for code formatting and Husky for Git hooks to ensure consistent code style.

## Setup

### Prettier Configuration

- **Config File**: `.prettierrc`
- **Ignore File**: `.prettierignore`

### Husky Git Hooks

- **Pre-commit**: Runs `lint-staged` to format staged files before commit
- **Pre-push**: Runs `prettier --check` to verify all files are formatted before push

## Scripts

- `npm run format` - Format all files in `src/`
- `npm run format:check` - Check if all files are formatted (used in pre-push hook)

## Usage

### Manual Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Automatic Formatting

Files are automatically formatted on commit via `lint-staged` and the pre-commit hook.

## Configuration

### Prettier Rules

- **Semicolons**: Disabled
- **Quotes**: Single quotes
- **Tab Width**: 2 spaces
- **Print Width**: 100 characters
- **Trailing Commas**: ES5 style
- **Arrow Parens**: Avoid parentheses when possible

### Lint-Staged

Only staged files matching these patterns are formatted:

- `*.{js,ts,vue,json,css,scss,md}`

## Refactoring Principles Applied

### DRY (Don't Repeat Yourself)

1. **DeleteConfirmationModal Component**: Reusable modal component for all delete confirmations
2. **useDeleteConfirmation Composable**: Reusable composable for delete modal state management

### Clean Code

- Consistent formatting across all files
- Reusable components and composables
- Clear separation of concerns

### Benefits

- **Consistency**: All code follows the same formatting rules
- **Automation**: No need to manually format code
- **Quality**: Prevents unformatted code from being committed
- **Maintainability**: Easier to read and maintain codebase
