# @ipcom/asterisk-ami

**@ipcom/asterisk-ami** é um cliente AMI (Asterisk Manager Interface) desenvolvido em TypeScript. Ele permite que você se conecte ao Asterisk através da porta 5038/TCP ou qualquer outra porta configurada no `manager.conf`, escutando eventos padrão do Asterisk e realizando requisições de ações.

## Sumário

- [Instalação](#instalação)
- [Compatibilidade de Versões](#compatibilidade-de-versões)
- [Uso Básico](#uso-básico)
- [Configuração do Asterisk](#configuração-do-asterisk)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Exemplos de Código](#exemplos-de-código)
- [API e Tipagem](#api-e-tipagem)
- [Atualização de Tipos](#atualização-de-tipos)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato e Suporte](#contato-e-suporte)

## Instalação

Para instalar o módulo, você pode usar npm ou yarn:

```bash
npm install @ipcom/asterisk-ami
# ou
yarn add @ipcom/asterisk-ami
```

## Compatibilidade de Versões

Este módulo suporta **Asterisk 18 LTS** e **Asterisk 20 LTS** com tipagem TypeScript 100% precisa.

| Versão do Asterisk | Suporte | Recursos Específicos |
|-------------------|---------|---------------------|
| **Asterisk 18** | ✅ Completo | Todos os eventos e ações padrão |
| **Asterisk 20** | ✅ Completo | + QueueSummary, QueueSummaryComplete |
| Asterisk 16 e anterior | ⚠️ Compatível | Não testado oficialmente |
| Asterisk 21+ | 🔄 Futuro | Planejado |

### Especificar Versão (Opcional)

Por padrão, o módulo assume Asterisk 18. Para usar recursos específicos do Asterisk 20:

```typescript
const ami = new Eami({
    host: '192.168.0.10',
    port: 5038,
    userName: 'amiIpcom',
    password: 'amiIpcomPass',
    additionalOptions: {
        version: '20',  // Habilita recursos do Asterisk 20
        debug: false,
        emitAllEvents: true
    }
});
```

## Uso Básico
### Conectando ao Asterisk
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

### Criando uma Ação para Originar uma Ligação
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
            Timeout: 30000, // Em milisegundos
            Variable: `variable1=myVariable1,variable2=myVariable2`,
            ActionID: '123456789',
            Action: 'Originate',
        });
    console.log(originateCall);
} catch (e) {
    console.log(e);
}
```

### Escutando Eventos
```typescript
ami.events.on('events', async (evt) => {
    if (evt.Event === 'AgentComplete') {
        console.log(evt);
    }
});

// Ou
// Usando Type Guards para eventos específicos:
import { type isAgentComplete } from '@ipcom/asterisk-ami';

ami.events.on('events', async (evt) => {
    if (isAgentComplete(evt)) {
        console.log(evt);
    }
});
```

## Configuração do Asterisk
Para utilizar o módulo @ipcom/asterisk-ami, é necessário configurar o manager.conf no Asterisk:
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

Para verificar se o Asterisk está conectado corretamente, execute o seguinte comando na CLI do Asterisk:

```bash
manager show connected
```
Isso deve retornar algo como:
```bash
ipcomcloud*CLI> manager show connected
Username         IP Address        Start       Elapsed   FileDes   HttpCnt   Read   Write
amiIpcom         192.168.0.1       1723835531  12074     11        0         08191  08191
1 users connected.
```
### Funcionalidades Principais

**Escutar Eventos:** O módulo pode escutar uma ampla variedade de eventos do Asterisk, como AgentDump, AgentLogin, AgentLogoff, QueueMember, entre outros.

**Executar Ações:** Execute ações no Asterisk como PJSIPHangup, PJSIPNotify, Originate, e muitas outras.

**Tipagem Completa:** Feito em TypeScript, garantindo tipagem completa para todos os eventos e ações.
- ✅ 182 eventos tipados com precisão de 100%
- ✅ 24 ações verificadas contra documentação oficial
- ✅ 82.2% dos enums com valores 100% precisos
- ✅ Suporte a IntelliSense completo para ChannelState e outros enums

### Exemplos de Código
Os exemplos já foram incluídos nas seções anteriores de uso básico.

### API e Tipagem
Ainda em desenvolvimento. A documentação completa da API será lançada em breve, incluindo detalhes sobre todos os eventos e ações suportadas.

## Atualização de Tipos

Esta biblioteca passou por uma **auditoria completa de tipos** em dezembro de 2024, corrigindo 922+ inconsistências de tipos para garantir precisão de 100% com a especificação AMI do Asterisk.

### Mudanças Importantes (Somente em Nível de Tipo)

As seguintes mudanças melhoram a segurança de tipos mas **não quebram código em tempo de execução**:

1. **`Exten`**: Agora corretamente tipado como `string` (anteriormente `number`)
   - Suporta extensões nomeadas: `"s"`, `"i"`, `"operator"`
   - Suporta padrões: `"_X."`, `"_[2-9]XXXXXX"`

2. **`CallerID`**: Agora corretamente tipado como `string` (anteriormente `number`)
   - Suporta formato completo: `"Nome <5551234>"`

3. **`ChannelState`**: Agora enumerado como `0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9`
   - IntelliSense completo com documentação inline
   - Validação em tempo de compilação

### Migrando Código Existente

Se você atualizar e encontrar erros de tipo, veja [MIGRATION.md](./MIGRATION.md) para padrões de correção detalhados.

**Exemplo de correção rápida:**
```typescript
// Antes (causará erro de tipo)
Exten: 1234

// Depois (correto)
Exten: '1234'
```

Para detalhes completos, veja:
- [CHANGELOG.md](./CHANGELOG.md) - Lista completa de mudanças
- [MIGRATION.md](./MIGRATION.md) - Guia de migração detalhado

### Contribuição
Estamos abertos a contribuições! Se você deseja ajudar a melhorar este módulo, sinta-se à vontade para fazer um fork e enviar pull requests. Estamos especialmente interessados em adicionar mais tipagens e exemplos de uso. Diretrizes mais detalhadas serão publicadas em breve.

### Licença
Este projeto é licenciado sob a MIT License.

### Contato e Suporte
Para suporte, entre em contato via Twitter.
Link para meu perfil [@real_fftheodoro](https://x.com/real_fftheodoro/).
