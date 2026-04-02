# Migration Guide: Type Accuracy Update

## Overview

This update corrects **922+ type inconsistencies** to match the official Asterisk AMI specification (versions 18 and 20). All changes are **type-level only** and backward compatible at runtime.

**What this means for you:**
- Your code will continue to run without changes
- TypeScript compilation may show new type errors
- These errors indicate incorrect usage that was previously not caught
- Fixing these errors prevents runtime bugs in production

## Table of Contents

1. [Breaking Changes (Type-Level)](#breaking-changes-type-level)
2. [Quick Reference: Common Fixes](#quick-reference-common-fixes)
3. [New Features](#new-features)
4. [Automated Migration](#automated-migration)
5. [Detailed Fix Patterns](#detailed-fix-patterns)
6. [Benefits of This Update](#benefits-of-this-update)

## Breaking Changes (Type-Level)

### 1. Exten: `number` → `string`

**Severity**: CRITICAL - Breaks named extension support

**Before:**
```typescript
await ami.actions.Originate({
    Action: 'Originate',
    Channel: 'PJSIP/1000',
    Exten: 1234,  // ✗ Type error after update
    Context: 'default',
    Priority: 1
});
```

**After:**
```typescript
await ami.actions.Originate({
    Action: 'Originate',
    Channel: 'PJSIP/1000',
    Exten: '1234',  // ✓ Correct
    Context: 'default',
    Priority: 1
});

// Named extensions now work correctly
await ami.actions.Originate({
    Action: 'Originate',
    Channel: 'PJSIP/1000',
    Exten: 's',  // ✓ Special extension
    Context: 'default',
    Priority: 1
});

// Pattern matching extensions
await ami.actions.Redirect({
    Channel: 'PJSIP/1000-00000001',
    Exten: '_X.',  // ✓ Pattern matching
    Context: 'default',
    Priority: 1
});
```

**Why this matters:**
- Extensions in Asterisk can be:
  - Numeric: `"100"`, `"5551234"`
  - Named: `"s"` (start), `"i"` (invalid), `"h"` (hangup), `"t"` (timeout), `"operator"`
  - Patterns: `"_X."`, `"_[2-9]XXXXXX"`, `"_1800NXXXXXX"`
- The old `number` type prevented using named extensions and patterns

**Affected actions:**
- `Originate` (2 instances)
- `Redirect` (1 instance)
- `Bridge` (indirect usage)

---

### 2. CallerID: `number` → `string`

**Severity**: CRITICAL - Breaks caller name display

**Before:**
```typescript
await ami.actions.Originate({
    Action: 'Originate',
    Channel: 'PJSIP/1000',
    CallerID: 4531225150,  // ✗ Type error after update
    Exten: '1000',
    Context: 'default',
    Priority: 1
});
```

**After:**
```typescript
await ami.actions.Originate({
    Action: 'Originate',
    Channel: 'PJSIP/1000',
    CallerID: '4531225150',  // ✓ Correct
    Exten: '1000',
    Context: 'default',
    Priority: 1
});

// With caller name (now supported)
await ami.actions.Originate({
    Action: 'Originate',
    Channel: 'PJSIP/1000',
    CallerID: 'John Doe <4531225150>',  // ✓ Full CallerID format
    Exten: '1000',
    Context: 'default',
    Priority: 1
});
```

**Why this matters:**
- CallerID format in Asterisk: `"Display Name <Number>"`
- Examples:
  - `"4531225150"` - number only
  - `"John Doe <4531225150>"` - with display name
  - `"<4531225150>"` - number in angle brackets
- The old `number` type prevented setting display names

**Affected actions:**
- `Originate` (1 instance)
- `SetVar` (indirect CallerID manipulation)

---

### 3. ChannelState: `string` → `0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9`

**Severity**: MAJOR - Improves type safety significantly

**Before:**
```typescript
ami.events.on('events', (evt) => {
    if (evt.Event === 'Newstate') {
        // No autocomplete, no validation
        if (evt.ChannelState === '6') {  // ✗ String comparison (inconsistent)
            console.log('Channel is up');
        }
    }
});
```

**After:**
```typescript
ami.events.on('events', (evt) => {
    if (evt.Event === 'Newstate') {
        // Full IntelliSense support, compile-time validation
        if (evt.ChannelState === 6) {  // ✓ Numeric comparison (correct)
            console.log('Channel is up');
        }

        // IDE shows all possible values: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    }
});

// Use constants for clarity
const CHANNEL_STATES = {
    DOWN: 0,
    RESERVED: 1,
    OFFHOOK: 2,
    DIALING: 3,
    RING: 4,
    RINGING: 5,
    UP: 6,
    BUSY: 7,
    DIALING_OFFHOOK: 8,
    PRERING: 9
} as const;

if (evt.ChannelState === CHANNEL_STATES.UP) {  // ✓ Clear and type-safe
    console.log('Channel is up');
}
```

**Why this matters:**
- ChannelState is one of the most frequently used AMI fields
- Different events were defining it as `string`, `number`, or `string | number`
- Now all events use the same precise enumeration
- Full IntelliSense support with value documentation

**Affected events:** 90+ events including:
- `Newstate`, `Newchannel`, `Hangup`
- `DialBegin`, `DialEnd`
- `BridgeEnter`, `BridgeLeave`
- And many more

---

### 4. Uniqueid/Linkedid: `number` → `string`

**Severity**: MAJOR - Prevents identifier confusion

**Before:**
```typescript
ami.events.on('events', (evt) => {
    if (evt.Event === 'Newchannel') {
        const id = evt.Uniqueid;  // Was number, but actually string at runtime
        // Could cause comparison bugs: 123 !== "123"
    }
});
```

**After:**
```typescript
ami.events.on('events', (evt) => {
    if (evt.Event === 'Newchannel') {
        const id: string = evt.Uniqueid;  // ✓ Correct type
        // Consistent string handling prevents comparison bugs
    }
});
```

**Why this matters:**
- Uniqueid and Linkedid are string identifiers in AMI protocol
- Format: `"<timestamp>.<sequence>"` (e.g., `"1638360000.123"`)
- The old `number` type caused type confusion and potential comparison bugs

**Affected events:** 453 instances across most channel-related events

---

### 5. Priority: `string | number` → `string`

**Severity**: MAJOR - Narrows type for consistency

**Before:**
```typescript
ami.events.on('events', (evt) => {
    if (evt.Event === 'Newexten') {
        const prio = evt.Priority;  // Could be string or number
        // Required type guards or dual handling
    }
});
```

**After:**
```typescript
ami.events.on('events', (evt) => {
    if (evt.Event === 'Newexten') {
        const prio: string = evt.Priority;  // ✓ Always string
        // No type guards needed, consistent handling
    }
});
```

**Why this matters:**
- AMI always returns Priority as a string
- The overly broad `string | number` union reduced type safety
- Now consistent across all events

**Affected events:** 172 instances

---

## Quick Reference: Common Fixes

| Old Code | New Code | Why |
|----------|----------|-----|
| `Exten: 1234` | `Exten: '1234'` | Extensions are strings |
| `CallerID: 5551234` | `CallerID: '5551234'` | CallerID is string |
| `ChannelState === '6'` | `ChannelState === 6` | ChannelState is numeric enum |
| `id: number = evt.Uniqueid` | `id: string = evt.Uniqueid` | IDs are strings |
| `prio: string \| number` | `prio: string` | Priority is always string |

---

## New Features

### Version Support

**New:** Generic version parameter for Asterisk 18/20 support

**Usage:**

```typescript
// Asterisk 18 (default, no change needed)
const ami = new eAmi({
    host: '192.168.0.10',
    port: 5038,
    userName: 'amiUser',
    password: 'amiPass',
    additionalOptions: {
        debug: false,
        emitAllEvents: true
    }
});

// Asterisk 20 (new, opt-in for version-specific features)
const ami20 = new eAmi({
    host: '192.168.0.10',
    port: 5038,
    userName: 'amiUser',
    password: 'amiPass',
    additionalOptions: {
        debug: false,
        emitAllEvents: true,
        version: '20'  // ← New parameter
    }
});

// Version-specific event handling
ami20.events.on('events', (evt) => {
    if (evt.Event === 'QueueSummary') {  // Asterisk 20 only
        console.log('Queue statistics:', evt);
    }
});
```

**Benefits:**
- Type-safe version-specific features
- Defaults to Asterisk 18 (backward compatible)
- Future-proof for Asterisk 21+ support

---

## Automated Migration

### Step 1: Run TypeScript Compiler

```bash
npm run build
# or
tsc --noEmit
```

### Step 2: Fix Type Errors

You'll see errors like:

```
error TS2322: Type 'number' is not assignable to type 'string'.
  Exten: 1234,
  ~~~~~
```

### Step 3: Apply Fixes

Use the patterns in this guide to fix each error.

### Step 4: Verify

```bash
npm run build
# Should complete without type errors
```

---

## Detailed Fix Patterns

### Pattern 1: Numeric Literals to Strings

**Find:**
```typescript
Exten: 1234
CallerID: 5551234
```

**Replace with:**
```typescript
Exten: '1234'
CallerID: '5551234'
```

### Pattern 2: Number Variables to Strings

**Find:**
```typescript
const extension = 1234;
await ami.actions.Originate({
    Exten: extension,
    // ...
});
```

**Replace with:**
```typescript
const extension = 1234;
await ami.actions.Originate({
    Exten: String(extension),  // or extension.toString()
    // ...
});
```

### Pattern 3: ChannelState Comparisons

**Find:**
```typescript
if (evt.ChannelState === '6') { }
if (evt.ChannelState === 6) { }  // Both may exist
```

**Replace with:**
```typescript
// Use numeric comparisons consistently
if (evt.ChannelState === 6) { }

// Or use constants for clarity
const CHANNEL_STATE = {
    UP: 6,
    DOWN: 0,
    BUSY: 7
} as const;

if (evt.ChannelState === CHANNEL_STATE.UP) { }
```

### Pattern 4: Identifier Type Annotations

**Find:**
```typescript
const channelId: number = evt.Uniqueid;
const linkedCall: number = evt.Linkedid;
```

**Replace with:**
```typescript
const channelId: string = evt.Uniqueid;
const linkedCall: string = evt.Linkedid;
```

### Pattern 5: Priority Handling

**Find:**
```typescript
const priority: string | number = evt.Priority;
if (typeof priority === 'number') {
    // Handle numeric priority
}
```

**Replace with:**
```typescript
const priority: string = evt.Priority;
// No type guard needed, always string
```

---

## Benefits of This Update

### 1. Catch Bugs at Compile Time

**Before:**
```typescript
// Would compile but fail at runtime
await ami.actions.Originate({
    Exten: 's',  // Named extension
    // ... runtime error: expected number, got string
});
```

**After:**
```typescript
// Compiles correctly, works at runtime
await ami.actions.Originate({
    Exten: 's',  // ✓ Type-safe
    // ...
});
```

### 2. Better IDE Support

- Full IntelliSense for all event types
- Autocomplete for ChannelState values
- Inline documentation for enum values
- Instant error detection while typing

### 3. Safer Refactoring

- Type system catches breaking changes immediately
- Confident code modifications
- Reduced testing burden

### 4. Production Reliability

- Fewer runtime type errors
- Consistent type handling across codebase
- Better error messages

---

## Common Questions

### Q: Will my existing code break at runtime?

**A:** No. All changes are type-level only. Your code will run exactly as before.

### Q: Why am I seeing type errors now?

**A:** The type system is now catching incorrect usage that was previously hidden. This is a good thing - it helps prevent runtime bugs.

### Q: Do I need to update immediately?

**A:** No rush, but updating is recommended. The type errors indicate potential bugs in your code that should be fixed.

### Q: What if I can't fix all errors at once?

**A:** You can temporarily use type assertions while you migrate:

```typescript
// Temporary workaround (not recommended long-term)
Exten: 1234 as any as string
```

But it's better to fix the root cause.

### Q: How long will migration take?

**A:** Most projects can be migrated in 1-2 hours. The fixes are straightforward and follow consistent patterns.

---

## Support

If you encounter issues during migration:

1. **Check this guide** - Most issues are covered here
2. **Review CHANGELOG.md** - See all changes at a glance
3. **Contact support** - [@real_fftheodoro](https://x.com/real_fftheodoro) on Twitter
4. **Open an issue** - GitHub repository (if available)

---

## Summary

This update brings **922+ type improvements** across 182 events and 24 actions, making @ipcom/asterisk-ami the most type-accurate Asterisk AMI library available for TypeScript.

**Key takeaways:**
- All changes are backward compatible at runtime
- Type errors indicate bugs that should be fixed
- Migration is straightforward with clear patterns
- Your code will be safer and more maintainable after migration

**Migration effort:** 1-2 hours for most projects
**Risk level:** Low (type-level only)
**Value:** High (prevents runtime bugs, improves DX)
