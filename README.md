# @ipcom/asterisk-ami

> **Part of the FreePBX / voice ecosystem.** This fork of `@ipcom/asterisk-ami` is kept for reference; no current project uses it. How this repo fits with the other FreePBX/Asterisk voice projects (what runs on pbx01, which repo owns which piece, what lives outside git) is documented in the shared hub, [ExactDoug/freepbx-docs-shared](https://github.com/ExactDoug/freepbx-docs-shared) (local: `~/dev/projects/github/freepbx-docs-shared`). Start with its `project-ecosystem-overview.md`.

**@ipcom/asterisk-ami** is an AMI (Asterisk Manager Interface) client developed in TypeScript. It allows you to connect to Asterisk through TCP port 5038 or any other port configured in `manager.conf`, listening to standard Asterisk events and performing action requests.

## Table of Contents

- [Installation](#installation)
- [Version Compatibility](#version-compatibility)
- [Basic Usage](#basic-usage)
- [Asterisk Configuration](#asterisk-configuration)
- [Key Features](#key-features)
- [Code Examples](#code-examples)
- [API and Typing](#api-and-typing)
- [Type Updates](#type-updates)
- [Contributing](#contributing)
- [License](#license)
- [Contact and Support](#contact-and-support)

## Installation

To install the module, you can use npm or yarn:

```bash
npm install @ipcom/asterisk-ami
# or
yarn add @ipcom/asterisk-ami
```

## Version Compatibility

This module supports **Asterisk 18 LTS** and **Asterisk 20 LTS** with 100% accurate TypeScript typing.

| Asterisk Version | Support | Specific Features |
|------------------|---------|------------------|
| **Asterisk 18** | ✅ Complete | All standard events and actions |
| **Asterisk 20** | ✅ Complete | + QueueSummary, QueueSummaryComplete |
| Asterisk 16 and earlier | ⚠️ Compatible | Not officially tested |
| Asterisk 21+ | 🔄 Future | Planned |

### Specify Version (Optional)

By default, the module assumes Asterisk 18. To use Asterisk 20 specific features:

```typescript
const ami = new Eami({
    host: '192.168.0.10',
    port: 5038,
    userName: 'amiIpcom',
    password: 'amiIpcomPass',
    additionalOptions: {
        version: '20',  // Enables Asterisk 20 features
        debug: false,
        emitAllEvents: true
    }
});
```

## Basic Usage
### Connecting to Asterisk
```typescript
import { eAmi as Eami } from '@ipcom/asterisk-ami';

export const ami = new Eami({
    host: '192.168.0.10',
    port: 5038,
    userName: 'amiIpcom',
    password: 'amiIpcomPass',
    additionalOptions: {
        debug: false,
        emitAllEvents: true,
        reconnect: true,
        resendAction: false,
     },
    });
```

### Creating an Action to Originate a Call
```typescript
try {
    const originateCall = await ami.actions
        .Originate({
            Channel: `PJSIP/1000`,
            CallerID: Number(4531225150),
            Context: 'default',
            Priority: 1,
            Async: true,
            ChannelId: '123456789',
            Exten: Number(4531225150),
            Timeout: 30000, // In milliseconds
            Variable: `variable1=myVariable1,variable2=myVariable2`,
            ActionID: '123456789',
            Action: 'Originate',
        });
    console.log(originateCall);
} catch (e) {
    console.log(e);
}
```

### Listening to Events
```typescript
ami.events.on('events', async (evt) => {
    if (evt.Event === 'AgentComplete') {
        console.log(evt);
    }
});

// Or
// Using Type Guards for specific events:
import { type isAgentComplete } from '@ipcom/asterisk-ami';

ami.events.on('events', async (evt) => {
    if (isAgentComplete(evt)) {
        console.log(evt);
    }
});
```

## Asterisk Configuration
To use the @ipcom/asterisk-ami module, you need to configure manager.conf in Asterisk:
```ini
[general]
enabled = yes
port = 5038
bindaddr = 0.0.0.0

[amiIpcom]
secret = amiIpcomPass
deny=0.0.0.0/0.0.0.0
permit=127.0.0.1/255.0.0.0
permit=192.168.0.1/255.255.255.255
writetimeout = 5000
read = system,call,log,verbose,command,agent,user,config,command,dtmf,reporting,cdr,dialplan,originate
write = system,call,log,verbose,command,agent,user,config,command,dtmf,reporting,cdr,dialplan,originate
displayconnects = no
```

To verify that Asterisk is connected correctly, run the following command in the Asterisk CLI:

```bash
manager show connected
```
This should return something like:
```bash
ipcomcloud*CLI> manager show connected
Username         IP Address        Start       Elapsed   FileDes   HttpCnt   Read   Write
amiIpcom         192.168.0.1       1723835531  12074     11        0         08191  08191
1 users connected.
```
### Key Features

**Listen to Events:** The module can listen to a wide variety of Asterisk events, such as AgentDump, AgentLogin, AgentLogoff, QueueMember, among others.

**Execute Actions:** Execute actions in Asterisk such as PJSIPHangup, PJSIPNotify, Originate, and many others.

**Complete Typing:** Built in TypeScript, ensuring complete typing for all events and actions.
- ✅ 182 events typed with 100% accuracy
- ✅ 24 actions verified against official documentation
- ✅ 82.2% of enums with 100% accurate values
- ✅ Full IntelliSense support for ChannelState and other enums

### Code Examples
Examples have already been included in the previous basic usage sections.

### API and Typing
Still under development. Complete API documentation will be released soon, including details about all supported events and actions.

## Type Updates

This library underwent a **complete type audit** in December 2024, fixing 922+ type inconsistencies to ensure 100% accuracy with the Asterisk AMI specification.

### Breaking Changes (Type-Level Only)

The following changes improve type safety but **do not break runtime code**:

1. **`Exten`**: Now correctly typed as `string` (previously `number`)
   - Supports named extensions: `"s"`, `"i"`, `"operator"`
   - Supports patterns: `"_X."`, `"_[2-9]XXXXXX"`

2. **`CallerID`**: Now correctly typed as `string` (previously `number`)
   - Supports full format: `"Name <5551234>"`

3. **`ChannelState`**: Now enumerated as `0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9`
   - Full IntelliSense with inline documentation
   - Compile-time validation

### Migrating Existing Code

If you upgrade and encounter type errors, see [MIGRATION.md](./MIGRATION.md) for detailed fix patterns.

**Quick fix example:**
```typescript
// Before (will cause type error)
Exten: 1234

// After (correct)
Exten: '1234'
```

For complete details, see:
- [CHANGELOG.md](./CHANGELOG.md) - Complete list of changes
- [MIGRATION.md](./MIGRATION.md) - Detailed migration guide

### Contributing
We welcome contributions! If you want to help improve this module, feel free to fork and submit pull requests. We are especially interested in adding more typings and usage examples. More detailed guidelines will be published soon.

### License
This project is licensed under the MIT License.

### Contact and Support
For support, contact via Twitter.
Link to my profile [@real_fftheodoro](https://x.com/real_fftheodoro/).
