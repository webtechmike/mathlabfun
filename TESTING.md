# Testing Documentation

## Overview

This project includes comprehensive tests for the spacebucks calculation system to ensure the reward rules work correctly and don't break during future refactoring.

## Test Setup

### Dependencies

-   **Jest**: Testing framework
-   **React Testing Library**: Component testing utilities
-   **Husky**: Git hooks for pre-commit testing
-   **lint-staged**: Run tests on staged files

### Test Files

1. **`src/components/Game4/__tests__/calculateReward.test.ts`**

    - Unit tests for the core `calculateReward` function
    - Tests all reward calculation logic in isolation
    - 25 test cases covering all scenarios

2. **`src/components/Game4/__tests__/spacebucks-rules.test.ts`**
    - Focused tests for spacebucks calculation rules
    - Tests business logic without complex integration
    - 25 test cases covering edge cases and examples

## Running Tests

### Development Mode

```bash
npm test
```

Runs tests in watch mode with interactive interface.

### CI Mode

```bash
npm run test:ci
```

Runs all tests once and exits (used in CI/CD and pre-commit hooks).

### Pre-commit Hook

Tests run automatically before each commit via Husky. If tests fail, the commit is blocked.

## Test Coverage

### Base Reward Rules

-   ✅ Addition: 1 spacebuck
-   ✅ Subtraction: 2 spacebucks
-   ✅ Multiplication: 3 spacebucks
-   ✅ Division: 3 spacebucks
-   ✅ Unknown operations: 1 spacebuck (default)

### Level-Based Bonus

-   ✅ +1 bonus spacebuck for every 2 levels (level 2+, 4+, 6+, etc.)
-   ✅ Level 1: No bonus (base rewards only)
-   ✅ Level 2-3: +1 bonus spacebuck
-   ✅ Level 4-5: +2 bonus spacebucks
-   ✅ Level 6-7: +3 bonus spacebucks

### Negative Result Bonus

-   ✅ +1 bonus spacebuck for problems with negative results (higher levels only)
-   ✅ Works when the answer is negative (e.g., 7 - 8 = -1)
-   ✅ Works with any operation that produces a negative result
-   ✅ No bonus for positive results or zero
-   ✅ Currently disabled in level 1 (easier difficulty)

### Super Streak Bonus

-   ✅ Double rewards when dailyStreak >= 3
-   ✅ No doubling when dailyStreak < 3
-   ✅ Applied after negative number bonus

### Complex Scenarios

-   ✅ Multiplication with negative numbers and super streak = 8 spacebucks
-   ✅ Addition with negative numbers and super streak = 4 spacebucks
-   ✅ Subtraction with negative numbers and super streak = 6 spacebucks

### Edge Cases

-   ✅ Null/undefined question handling
-   ✅ Undefined inputs handling
-   ✅ Zero value handling
-   ✅ Unknown operation handling

## Example Calculations

| Operation      | Numbers     | Level | Super Streak | Expected Reward                                      |
| -------------- | ----------- | ----- | ------------ | ---------------------------------------------------- |
| Addition       | 5 + 3       | 1     | No           | 1 spacebuck                                          |
| Addition       | 5 + 3       | 2     | No           | 2 spacebucks (1 + 1 level bonus)                     |
| Addition       | 5 + 3       | 4     | No           | 3 spacebucks (1 + 2 level bonus)                     |
| Addition       | -5 + 2 = -3 | 6     | No           | 5 spacebucks (1 + 1 negative result + 3 level bonus) |
| Subtraction    | 8 - 3       | 1     | No           | 2 spacebucks                                         |
| Subtraction    | 7 - 8 = -1  | 1     | No           | 3 spacebucks (2 + 1 negative result)                 |
| Subtraction    | 8 - 3       | 4     | Yes          | 8 spacebucks ((2 + 2 level bonus) × 2)               |
| Multiplication | 4 × 6       | 1     | No           | 3 spacebucks                                         |
| Multiplication | 4 × 6       | 6     | Yes          | 12 spacebucks ((3 + 3 level bonus) × 2)              |

## Pre-commit Hook Configuration

### Husky Setup

The pre-commit hook is configured in `.husky/pre-commit` and runs:

1. All tests (`npm run test:ci`)
2. Blocks commit if tests fail

### lint-staged Configuration

Configured in `package.json` to run:

-   ESLint fixes on staged files
-   Tests on staged files

## Adding New Tests

### For New Features

1. Create test file in appropriate `__tests__` directory
2. Follow naming convention: `feature-name.test.ts`
3. Include both positive and negative test cases
4. Test edge cases and error conditions

### For Bug Fixes

1. Add test that reproduces the bug
2. Verify the fix makes the test pass
3. Add regression tests to prevent future issues

## Test Best Practices

### Naming

-   Use descriptive test names that explain the scenario
-   Group related tests using `describe` blocks
-   Use clear, readable variable names

### Structure

-   Arrange: Set up test data
-   Act: Execute the function being tested
-   Assert: Verify the expected outcome

### Coverage

-   Test happy path scenarios
-   Test edge cases and error conditions
-   Test boundary values
-   Test invalid inputs

## Troubleshooting

### Common Issues

1. **Firebase Configuration Errors**

    - Tests mock Firebase functions to avoid configuration issues
    - If you see Firebase errors, check that mocks are properly set up

2. **Import Path Issues**

    - Ensure test files are in the correct directory structure
    - Use relative paths from test file location

3. **Test Failures**
    - Check that the business logic hasn't changed
    - Verify test expectations match current implementation
    - Run tests individually to isolate issues

### Debugging

-   Use `console.log` in tests for debugging
-   Run specific test files: `npm test -- calculateReward.test.ts`
-   Use Jest's `--verbose` flag for more detailed output

## Continuous Integration

The test suite is designed to run in CI/CD environments:

-   Uses `npm run test:ci` for non-interactive execution
-   Exits with code 1 on test failure
-   Compatible with GitHub Actions, GitLab CI, etc.

## Future Enhancements

Potential improvements to the testing setup:

-   Add integration tests with mocked Firebase
-   Add visual regression tests for UI components
-   Add performance tests for reward calculations
-   Add accessibility tests for user interface
