# 🔐 Configuração Segura do Telegram no OpenClaw

## ✅ Configuração Completada

Seu token Telegram foi configurado de forma **segura** usando o método de arquivo separado.

---

## 📋 Arquivos Criados

### 1. **`.env.local`** ✅
- Arquivo com suas credenciais sensíveis
- **NÃO é commitado** (está no `.gitignore`)
- Carregado automaticamente pelo OpenClaw

```bash
TELEGRAM_BOT_TOKEN=REDACTED_TOKEN
```

### 2. **`telegram-token.txt`** ✅
- Arquivo separado contendo apenas o token
- **NÃO é commitado** (está no `.gitignore`)
- Usado internamente para segurança de arquivo

```
REDACTED_TOKEN
```

### 3. **`.openclaw/config.json5`** ✅
- Configuração do Telegram (pode ter credenciais)
- **NÃO é commitado** (está no `.gitignore`)
- Aponta para `tokenFile` de forma segura

```json5
{
  channels: {
    telegram: {
      enabled: true,
      tokenFile: "/data/telegram-token.txt",
      dmPolicy: "pairing",
      groups: { "*": { requireMention: true } }
    }
  }
}
```

### 4. **`.env.railway`** ✅
- Variáveis de ambiente para Railway
- **Atualizado** com `TELEGRAM_BOT_TOKEN`

---

## 🔒 Ordem de Precedência do Token (mais seguro primeiro)

OpenClaw busca o token nesta ordem:

1. **`tokenFile`** (arquivo separado) ⭐ **RECOMENDADO**
   ```json5
   tokenFile: "/data/telegram-token.txt"
   ```

2. **`botToken`** (direto na config)
   ```json5
   botToken: "token-aqui"
   ```

3. **`TELEGRAM_BOT_TOKEN`** (variável de ambiente)
   ```bash
   export TELEGRAM_BOT_TOKEN=token-aqui
   ```

**Sua configuração usa o método 1 (mais seguro)** ✅

---

## 🚀 Como Usar

### Desenvolvemento Local

```bash
# O arquivo .env.local é carregado automaticamente
npm run dev
# ou
pnpm dev
```

### Docker

```bash
# Use o arquivo .env.local
docker compose --env-file .env.local up
```

### Railway

1. Vá para: `https://railway.app/project/seu-projeto/settings`
2. Adicione a variável de ambiente em Production:
   ```
   TELEGRAM_BOT_TOKEN=REDACTED_TOKEN
   ```
3. Deploy automático

---

## ✨ Benefícios Desta Configuração

✅ **Token separado do código**  
✅ **Não commitado no Git**  
✅ **Fácil mudar entre ambientes**  
✅ **Seguro para CI/CD**  
✅ **Suporta múltiplos bots (futuramente)**  

---

## 🧪 Testar Configuração

### Verificar se token foi carregado

```bash
# Listar configuração do Telegram
openclaw config get channels.telegram

# Ver status do Telegram
openclaw channels status --channel telegram
```

### Teste completo

```bash
# 1. Iniciar gateway
openclaw gateway

# 2. Em outro terminal, ver pairing
openclaw pairing list telegram

# 3. Enviar DM ao bot no Telegram
# Verificar código de pairing

# 4. Aprovar pairing
openclaw pairing approve telegram <CODIGO>
```

---

## 🛡️ Segurança - Checklist

- ✅ Token em arquivo separado (`telegram-token.txt`)
- ✅ Arquivo **não é commitado** (`.gitignore`)
- ✅ `.env.local` também protegido (`.gitignore`)
- ✅ Credenciais não hardcoded no código
- ✅ Suporta múltiplos ambientes (dev, test, prod)
- ✅ Railway: usa variáveis de ambiente (secrets)

---

## 📝 Próximos Passos

### 1. Configurar Telegram (BotFather)

Se ainda não fez:

```
Abra Telegram → busque @BotFather
/newbot
Escolha nome e username
Copie o token
```

✅ **Você já tem o token!**

### 2. Iniciar o Gateway

```bash
openclaw gateway
```

### 3. Aceitar Primeira Mensagem

- Envie uma DM ao seu bot no Telegram
- Veja o código de pairing: `openclaw pairing list telegram`
- Aprove: `openclaw pairing approve telegram <CODIGO>`

### 4. Testar em Grupos (opcional)

Edite `.openclaw/config.json5`:

```json5
{
  channels: {
    telegram: {
      enabled: true,
      tokenFile: "/data/telegram-token.txt",
      dmPolicy: "pairing",
      groupPolicy: "allowlist",
      groups: {
        "*": {
          requireMention: true
        },
        "-1001234567890": {
          requireMention: false
        }
      }
    }
  }
}
```

---

## ❓ FAQ

**P: Posso mudar o token depois?**  
R: Sim! Edite `telegram-token.txt` ou `.env.local` e reinicie.

**P: Perdi o token. Como recupero?**  
R: Vá em BotFather → `/mybots` → selecione seu bot → menu ⚙️ → API Token → Regenerate

**P: O token é compartilhado com alguém?**  
R: Não! Está em arquivos locais não commitados. Railway via secrets apenas.

**P: Posso usar para múltiplos bots?**  
R: Não por enquanto, mas a estrutura suporta (via `channels.telegram.accounts`).

---

## 🔗 Referências

- Documentação: https://docs.openclaw.ai/channels/telegram
- Configuração completa: https://docs.openclaw.ai/gateway/configuration

---

**Configuração criada em:** 21 de Fevereiro de 2026  
**Token:** `REDACTED_TOKEN`  
**Status:** ✅ Seguro e pronto para usar!
