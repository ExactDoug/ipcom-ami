# Type Correctness Tests for @ipcom/asterisk-ami

This directory contains TypeScript compilation tests that verify type correctness for the library.

## Test Files

### `type-compilation-test.ts`
Contains positive tests that should compile successfully. These tests verify:
- Exten field accepts string values
- CallerID field accepts string values
- ChannelState field accepts number values (0-9)
- Version parameter works correctly
- CallerIDNum/CallerIDName distinction is maintained
- Optional fields work correctly

**Run with:**
```bash
npx tsc --noEmit tests/type-compilation-test.ts
```

If this compiles without errors, all type fixes are working correctly.

### `type-negative-tests.ts`
Contains negative tests that should FAIL compilation. These tests verify:
- Exten rejects number values
- CallerID rejects number values
- ChannelState rejects string values
- CallerIDNum rejects string values
- CallerIDName rejects number values
- Version rejects invalid values

**To verify a specific test:**
1. Uncomment ONE test at a time
2. Run: `npx tsc --noEmit tests/type-negative-tests.ts`
3. Verify you get the expected compilation error
4. Comment it back out

Do NOT uncomment all tests at once!

## Test Coverage

### Action Interfaces
- ✅ I_ActionOriginate
  - Exten: string
  - CallerID: string
  - Context: string
  - Priority: string
  - Timeout: number

- ✅ I_ActionHangup
  - Channel: string
  - Cause: optional string

- ✅ I_ActionStatus
  - Channel: string
  - Variables: optional string
  - AllVariables: optional boolean

### Event Interfaces
- ✅ I_NewChannel
  - ChannelState: number
  - CallerIDNum: number
  - CallerIDName: string
  - Exten: string

- ✅ I_NewState
  - ChannelState: number
  - CallerIDNum: number
  - CallerIDName: string
  - Exten: string

- ✅ I_NewExten
  - Exten: string (modern field)
  - Extension: string (deprecated field)

- ✅ I_CoreShowChannel
  - ChannelState: number
  - CallerIDNum: number
  - CallerIDName: string
  - Exten: string

### Version Parameter
- ✅ Generic type parameter on eAmi class
- ✅ Accepts '18' and '20'
- ✅ Defaults to '18' when not specified

## Running All Tests

To verify all types are correct:

```bash
# Run positive tests (should pass)
npx tsc --noEmit tests/type-compilation-test.ts

# Run negative tests with one uncommented (should fail with specific error)
npx tsc --noEmit tests/type-negative-tests.ts
```

## Integration with CI/CD

You can add this to package.json scripts:

```json
{
  "scripts": {
    "test:types": "tsc --noEmit tests/type-compilation-test.ts"
  }
}
```

Then run with:
```bash
npm run test:types
```

## Notes

- These tests use TypeScript's compile-time type checking
- No runtime testing framework required
- Tests verify interface correctness, not runtime behavior
- Negative tests document what should NOT be allowed
