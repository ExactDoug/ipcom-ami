# 🔴 Memory Leak Report - @ipcom/asterisk-ami@0.0.28

## **Problem Context**

Node.js application with Asterisk AMI exhibits **JavaScript heap out of memory** after several hours in production:

```
FATAL ERROR: Ineffective mark-compacts near heap limit
Allocation failed - JavaScript heap out of memory
```

**Observed symptoms**:
1. ❌ `MaxListenersExceededWarning: 11 Action_1760380363392 listeners added`
2. ❌ Heap grows from ~200MB → 2GB → crash
3. ❌ GC (Garbage Collector) in loop unable to free memory

---

## **🔍 Critical Analysis Points in the Library**

### **1. CRITICAL: Temporary `Action_<timestamp>` listeners are not removed**

**Evidence of the problem**:
```
(node:584862) MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 Action_1760380363392 listeners added to [EventEmitter].
MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
```

**Observed pattern**: Each `ami.action()` call creates a listener named `Action_<timestamp>`.

**Suspected problematic implementation**:
```typescript
// Example of common problematic implementation
class Eami {
  async action(params: ActionParams): Promise<ActionResponse> {
    const actionId = `Action_${Date.now()}`;

    // ❌ PROBLEM: Listener is added but NEVER removed
    this.events.once(actionId, (response) => {
      return response;
    });

    // Send AMI command
    this.socket.write(`Action: ${params.Action}\r\nActionID: ${actionId}\r\n\r\n`);

    // ❌ MISSING: removeListener after timeout or response
  }
}
```

**What to investigate**:
- ✅ Is each `Action_*` listener being removed after receiving response?
- ✅ Is there a timeout implemented? If yes, is the listener removed on timeout?
- ✅ On error/rejection, is the listener cleaned up?
- ✅ Use `once()` instead of `on()` for single-use events
- ✅ Implement explicit cleanup: `this.events.removeListener(actionId, handler)`

**Usage volume in our code**: ~50 `ami.action()` calls per minute under heavy load.

---

### **2. CRITICAL: Global EventEmitter is not cleaned up on reconnections**

**Client code**:
```typescript
// src/services/Asterisk/Ami/AmiInitialize.ts
export const ami = new Eami({ /* config */ });

// setupConnectionListeners is called MULTIPLE times without cleanup
const setupConnectionListeners = (Ami: Eami) => {
  Ami.events.on(eAMI_EVENTS.CONNECT, () => { /* ... */ });
  Ami.events.on(eAMI_EVENTS.CLOSE, () => { /* ... */ });
  // ... 6 events total
};

// ❌ Called on every reconnection WITHOUT removeAllListeners before
attemptReconnection() {
  setupConnectionListeners(ami); // Adds 6 new listeners
}
```

**What the library should guarantee**:
- ✅ Should `ami.connect()` automatically cleanup old listeners?
- ✅ Does `ami.destroySocket()` remove all internal listeners?
- ✅ Is there clear documentation on when to call `events.removeAllListeners()`?

**Question**: Should the library expose a `ami.cleanup()` or `ami.reset()` method for use before reconnecting?

---

### **3. MEDIUM: Automatic reconnection pattern**

**Current configuration**:
```typescript
additionalOptions: {
  reconnect: true,
  heartbeatInterval: 5,
}
```

**What to investigate**:
- ✅ Does automatic reconnection (`reconnect: true`) clean up all resources before reconnecting?
- ✅ Does the heartbeat create listeners that accumulate?
- ✅ Is there a `maxReconnectAttempts` implemented? If not, it could cause infinite loop.

---

### **4. MEDIUM: Internal EventEmitter structure**

**Verify internally**:
```typescript
// Does the library use native Node.js EventEmitter?
import { EventEmitter } from 'events';

class Eami extends EventEmitter {
  // OR
  public events: EventEmitter;
}
```

**Common problematic patterns**:
❌ **Do not use `removeListener` after Promise resolves**
```typescript
return new Promise((resolve) => {
  this.events.once('response', resolve); // ← once() is good
  // BUT: What if timeout occurs? The listener stays forever
});
```

✅ **Correct pattern**:
```typescript
return new Promise((resolve, reject) => {
  const handler = (data) => {
    clearTimeout(timeoutId);
    this.events.removeListener('response', handler); // ← Explicit cleanup
    resolve(data);
  };

  const timeoutId = setTimeout(() => {
    this.events.removeListener('response', handler); // ← Cleanup on timeout
    reject(new Error('Timeout'));
  }, 5000);

  this.events.once('response', handler);
});
```

---

### **5. LOW: Memory profiling of library code**

**Test suggestion**:
```bash
# Run stress test with memory profiling
node --inspect --max-old-space-size=512 test-stress.js

# Connect to Chrome DevTools and take heap snapshot
# chrome://inspect
```

**Suggested test script** (for developer to create):
```javascript
const { eAmi } = require('@ipcom/asterisk-ami');

const ami = new eAmi({
  host: 'localhost',
  port: 5038,
  userName: 'admin',
  password: 'secret'
});

// Simulate 10,000 ami.action() calls
async function stressTest() {
  for (let i = 0; i < 10000; i++) {
    await ami.action({ Action: 'QueueStatus' });

    if (i % 100 === 0) {
      console.log(`Iteration ${i}:`, {
        listeners: ami.events.listenerCount(),
        memory: process.memoryUsage().heapUsed / 1024 / 1024
      });
    }
  }
}

ami.connect().then(stressTest);
```

**Expected result**:
- ✅ `listenerCount()` should remain **constant** (~10-20 fixed listeners)
- ✅ Memory should grow <50MB

**Problematic result**:
- ❌ `listenerCount()` grows linearly: 100 → 500 → 1000+
- ❌ Memory grows >500MB

---

## **📋 Verification Checklist for Developer**

### **Library source code**:
- [ ] Each `ami.action()` uses `once()` instead of `on()`
- [ ] All temporary listeners are removed after response/timeout/error
- [ ] `ami.destroySocket()` cleans up all internal EventEmitters
- [ ] `ami.connect()` does not accumulate listeners on reconnections
- [ ] Implement `ami.cleanup()` or `ami.reset()` public method
- [ ] Heartbeat does not create infinite listeners

### **Tests**:
- [ ] Stress test: 10,000 consecutive `ami.action()` calls
- [ ] Reconnection test: 50 cycles of connect/disconnect
- [ ] Memory profiling with heap snapshots
- [ ] Check `process.memoryUsage()` and `ami.events.eventNames().length`

### **Documentation**:
- [ ] Document when to call `removeAllListeners()`
- [ ] Example of correct usage in reconnections
- [ ] Warning about `ami.action()` calls in loops

---

## **🔧 Temporary Workarounds (Client Side)**

While waiting for library fix, we implemented:

1. **Increase listener limit**: `ami.events.setMaxListeners(50)`
2. **Manual cleanup before reconnecting**:
```typescript
const reconnect = () => {
  ami.events.removeAllListeners(); // ← Force cleanup
  ami.destroySocket();
  ami.connect();
};
```
3. **Limit pending message buffer**: Max 100 messages

---

## **📊 Environment Data**

- **Node.js**: v22+ (with optimized V8)
- **Library**: `@ipcom/asterisk-ami@0.0.28`
- **Load**: ~50 `ami.action()` per minute
- **Reconnections**: ~5-10 per day (Asterisk restarts)
- **Time to crash**: 4-8 hours in production

---

## **❓ Specific Questions for Developer**

1. **Does the library use `once()` or `on()` for temporary events?**
2. **Is there a `ami.cleanup()` or similar method to clean up resources?**
3. **Does automatic `reconnect: true` cleanup before reconnecting?**
4. **What is the expected behavior of `ami.destroySocket()`? Does it clean up listeners?**
5. **Are there any memory/stress tests in the library?**
6. **Is it possible to have access to the library source code for analysis?** (If not open source)

---

## **📂 Relevant Client Files**

### Main `ami.action()` calls:
- `src/services/UsersAgents/AddNewAgentToQueue.service.ts` - 12 calls
- `src/watchers/UseQueueMembers.ts` - 15 calls
- `src/sockets/message.socket.ts` - multiple calls in events

### AMI Configuration:
- `src/services/Asterisk/Ami/AmiInitialize.ts` - Setup and reconnection

---

## **🎯 Final Objective**

Eliminate the memory leak to allow:
- ✅ Application running **weeks** without restart
- ✅ Stable heap at ~200-500MB
- ✅ Zero `MaxListenersExceeded` warnings
- ✅ Healthy GC with fast cycles (<50ms)

---

**Report date**: 2025-10-13
**Library version analyzed**: @ipcom/asterisk-ami@0.0.28
**Environment**: Production - PBX IPCOM Backend
