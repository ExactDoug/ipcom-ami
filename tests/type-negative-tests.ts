/**
 * Negative Type Tests for @ipcom/asterisk-ami
 *
 * This file contains tests that SHOULD FAIL compilation.
 * These tests verify that incorrect types are properly rejected.
 *
 * To verify these tests work:
 * 1. Uncomment ONE test at a time
 * 2. Run: npx tsc --noEmit tests/type-negative-tests.ts
 * 3. Verify you get a compilation error
 * 4. Comment it back out and test the next one
 *
 * DO NOT uncomment all tests at once - this file should not compile as-is!
 */

import type {
    I_ActionOriginate,
} from '../src/interfaces/actions.interface.js';
import type {
    I_NewChannel,
} from '../src/interfaces/new.interface.js';
import { eAmi } from '../src/index.js';

// ============================================================================
// NEGATIVE TEST 1: Exten should NOT accept number
// ============================================================================
// EXPECTED ERROR: Type 'number' is not assignable to type 'string'
// const badExtenNumber: I_ActionOriginate = {
//     Action: 'Originate',
//     Channel: 'PJSIP/1001',
//     Exten: 1234,           // ✗ Should cause error (number)
//     Context: 'default',
//     Priority: '1',
//     Timeout: 30000,
// };

// ============================================================================
// NEGATIVE TEST 2: CallerID should NOT accept number
// ============================================================================
// EXPECTED ERROR: Type 'number' is not assignable to type 'string'
// const badCallerIDNumber: I_ActionOriginate = {
//     Action: 'Originate',
//     Channel: 'PJSIP/1001',
//     CallerID: 5551234,     // ✗ Should cause error (number)
//     Exten: '1000',
//     Context: 'default',
//     Priority: '1',
//     Timeout: 30000,
// };

// ============================================================================
// NEGATIVE TEST 3: ChannelState should NOT accept string
// ============================================================================
// EXPECTED ERROR: Type 'string' is not assignable to type 'number'
// const badChannelStateString: I_NewChannel = {
//     Event: 'Newchannel',
//     Privilege: 'call,all',
//     Channel: 'SIP/1001-00000001',
//     ChannelState: '6',     // ✗ Should cause error (string)
//     ChannelStateDesc: 'Up',
//     CallerIDNum: 1001,
//     CallerIDName: 'Test User',
//     ConnectedLineNum: 0,
//     ConnectedLineName: '',
//     Language: 'en',
//     AccountCode: 0,
//     Context: 'default',
//     Exten: '1000',
//     Priority: '1',
//     Uniqueid: '1234567890.123',
//     Linkedid: '1234567890.123',
// };

// ============================================================================
// NEGATIVE TEST 4: CallerIDNum should NOT accept string
// ============================================================================
// EXPECTED ERROR: Type 'string' is not assignable to type 'number'
// const badCallerIDNumString: I_NewChannel = {
//     Event: 'Newchannel',
//     Privilege: 'call,all',
//     Channel: 'SIP/1001-00000001',
//     ChannelState: 0,
//     ChannelStateDesc: 'Down',
//     CallerIDNum: '1001',   // ✗ Should cause error (string)
//     CallerIDName: 'Test User',
//     ConnectedLineNum: 0,
//     ConnectedLineName: '',
//     Language: 'en',
//     AccountCode: 0,
//     Context: 'default',
//     Exten: '1000',
//     Priority: '1',
//     Uniqueid: '1234567890.123',
//     Linkedid: '1234567890.123',
// };

// ============================================================================
// NEGATIVE TEST 5: CallerIDName should NOT accept number
// ============================================================================
// EXPECTED ERROR: Type 'number' is not assignable to type 'string'
// const badCallerIDNameNumber: I_NewChannel = {
//     Event: 'Newchannel',
//     Privilege: 'call,all',
//     Channel: 'SIP/1001-00000001',
//     ChannelState: 0,
//     ChannelStateDesc: 'Down',
//     CallerIDNum: 1001,
//     CallerIDName: 1001,    // ✗ Should cause error (number)
//     ConnectedLineNum: 0,
//     ConnectedLineName: '',
//     Language: 'en',
//     AccountCode: 0,
//     Context: 'default',
//     Exten: '1000',
//     Priority: '1',
//     Uniqueid: '1234567890.123',
//     Linkedid: '1234567890.123',
// };

// ============================================================================
// NEGATIVE TEST 6: Context should NOT accept number
// ============================================================================
// EXPECTED ERROR: Type 'number' is not assignable to type 'string'
// const badContextNumber: I_ActionOriginate = {
//     Action: 'Originate',
//     Channel: 'PJSIP/1001',
//     Exten: '1000',
//     Context: 123,          // ✗ Should cause error (number)
//     Priority: '1',
//     Timeout: 30000,
// };

// ============================================================================
// NEGATIVE TEST 7: Priority should NOT accept number (it's a string!)
// ============================================================================
// EXPECTED ERROR: Type 'number' is not assignable to type 'string'
// const badPriorityNumber: I_ActionOriginate = {
//     Action: 'Originate',
//     Channel: 'PJSIP/1001',
//     Exten: '1000',
//     Context: 'default',
//     Priority: 1,           // ✗ Should cause error (number)
//     Timeout: 30000,
// };

// ============================================================================
// NEGATIVE TEST 8: Version should NOT accept invalid values
// ============================================================================
// EXPECTED ERROR: Type '"21"' is not assignable to type 'AsteriskVersion'
// const badVersionInstance = new eAmi<'21'>({
//     host: '127.0.0.1',
//     port: 5038,
//     userName: 'admin',
//     password: 'secret',
//     additionalOptions: {
//         version: '21',     // ✗ Should cause error (invalid version)
//     },
// });

// ============================================================================
// NEGATIVE TEST 9: Version in options should match generic type
// ============================================================================
// EXPECTED ERROR: Type '"20"' is not assignable to type '"18"'
// const badVersionMismatch = new eAmi<'18'>({
//     host: '127.0.0.1',
//     port: 5038,
//     userName: 'admin',
//     password: 'secret',
//     additionalOptions: {
//         version: '20',     // ✗ Should cause error (mismatch)
//     },
// });

// ============================================================================
// NEGATIVE TEST 10: Timeout should NOT accept string
// ============================================================================
// EXPECTED ERROR: Type 'string' is not assignable to type 'number'
// const badTimeoutString: I_ActionOriginate = {
//     Action: 'Originate',
//     Channel: 'PJSIP/1001',
//     Exten: '1000',
//     Context: 'default',
//     Priority: '1',
//     Timeout: '30000',      // ✗ Should cause error (string)
// };

console.log('This file should not compile with any tests uncommented!');
console.log('Each uncommented test should produce a specific TypeScript error.');
console.log('Use these tests to verify type safety is working correctly.');
