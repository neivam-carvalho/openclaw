# 🔐 SECURITY: Credential Management Guide

## ⚠️ CRÍTICO: Ações Necessárias AGORA

### 1️⃣ **Rotacionar Token Telegram Imediatamente**

O token foi exposto no GitHub:
- **Token Exposto:** `REDACTED_TOKEN`
- **Status:** ❌ DEVE SER DESATIVADO

**Passos para rotacionar:**

```bash
# 1. Acesse BotFather no Telegram
# https://t.me/botfather

# 2. Envie: /mybots
# 3. Selecione seu bot (openclaw ou similar)
# 4. Clique em "API Token"
# 5. Clique em "Regenerate Token"

# 6. Copie o novo token
# Formato: 123456789:ABCDefGHIjklMNOpqrSTUvwXYZ123456789a

# 7. Configure no evento .env local ou Railway:
export TELEGRAM_BOT_TOKEN="seu-novo-token-aqui"
```

---

## 🛡️ Practices de Segurança Implementadas

### ✅ O que foi feito:

1. ✅ **Removido do histórico git** (git-filter-repo)
   - Commit `5585a0214` foi limpado
   - Arquivo `TELEGRAM_SETUP_SECURE.md` foi deletado

2. ✅ **Atualizado .gitignore** com regras de segurança
   - `.env*` files protegidos  
   - `*-token.txt` ignorados
   - `credentials/` não comitados
   - SSH keys protegidas

3. ✅ **Git remoto removido** (safety: offline para edits)

---

## 🔒 Como Gerenciar Credenciais Seguramente

### **Opção A: Variáveis de Ambiente (Recomendado)**

```bash
# 1. Criar .env.local (gitignored)
cat > .env.local << 'EOF'
TELEGRAM_BOT_TOKEN=seu-novo-token-aqui
ANTHROPIC_API_KEY=sk-ant-xxxxx
SETUP_PASSWORD=seu-password-seguro
EOF

# 2. Carregar no shell
source .env.local

# 3. Rodar aplicação
pnpm dev
# ou
node openclaw.mjs gateway
```

### **Opção B: Arquivo Separado (Melhor para Deploy)**

```bash
# 1. Criar arquivo de token seguro
mkdir -p /secure/configs
chmod 600 /secure/configs

echo "seu-novo-token-aqui" > /secure/configs/telegram-token.txt
chmod 400 /secure/configs/telegram-token.txt

# 2. Configurar no openclaw.json.config ou código
{
  "telegram": {
    "tokenFile": "/secure/configs/telegram-token.txt"
  }
}
```

### **Opção C: 1Password / Bitwarden / Vault**

```bash
# Usar secret manager nativo
export TELEGRAM_BOT_TOKEN=$(1password read "op://vault/telegram-bot/password")

# Ou Bitwarden
export TELEGRAM_BOT_TOKEN=$(bw get password TELEGRAM_BOT)

# Ou Hashicorp Vault
export TELEGRAM_BOT_TOKEN=$(vault kv get -field=token secret/telegram)
```

---

## 🚀 Para Hetzner VPS

### Configuração Segura:

```bash
# 1. SSH ao servidor
ssh root@89.167.84.48

# 2. Criar diretório seguro
mkdir -p /root/.openclaw
chmod 700 /root/.openclaw

# 3. Adicionar credenciais via arquivo
cat > /root/.openclaw/.env.production << 'EOF'
NODE_ENV=production
TELEGRAM_BOT_TOKEN=seu-novo-token
ANTHROPIC_API_KEY=sk-ant-xxxxx
SETUP_PASSWORD=seu-password-seguro
EOF

chmod 600 /root/.openclaw/.env.production

# 4. Rodar com segurança
source /root/.openclaw/.env.production
cd /home/openclaw/openclaw
pnpm build
node openclaw.mjs gateway --bind 0.0.0.0 --port 18789
```

---

## 🚢 Para Railway / Docker

### Usar Railway Variables (SEGURO):

```bash
# CLI local
railway variable set TELEGRAM_BOT_TOKEN="seu-novo-token"
railway variable set ANTHROPIC_API_KEY="sk-ant-xxxxx"
railway variable set SETUP_PASSWORD="seu-password-seguro"

# Verificar
railway variable list

# Deploy
railway deployment up
```

### Docker Compose (Local):

```yaml
version: '3.8'
services:
  openclaw:
    build: .
    environment:
      NODE_ENV: production
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      SETUP_PASSWORD: ${SETUP_PASSWORD}
    ports:
      - "8080:8080"
      - "18789:18789"
```

Rodar:
```bash
# Carregar vars
source .env.local

# Docker composerequiring environment
docker-compose up
```

---

## ✅ Audit Checklist

- [ ] **Token Telegram rotacionado** (@BotFather)
- [ ] **`.env.local` criado e em `.gitignore`**
- [ ] **Nenhuma credencial em `git log --all`**
- [ ] **Railway/Docker usando env vars**
- [ ] **SSH keys protegidas em `~/.ssh`**
- [ ] **Permissões corretas** (chmod 400/600)
- [ ] **HTTPS/TLS configurado** (Let's Encrypt)
- [ ] **Fire wall/security rules aplicadas**

---

## 🔍 Verificação de Segurança

```bash
# Procurar credenciais no histórico
git log -p --all | grep -i "token\|secret\|password\|api"

# Procurar no working directory
grep -r "sk-ant-\|7956450987\|ANTHROPIC_API" --include="*.js" --include="*.ts" --include="*.json"

# Verificar .gitignore
git check-ignore .env.local  # deve retormar .env.local

# Ver arquivos commitados (não deve haver .env)
git ls-files | grep -i ".env\|token\|secret"
```

---

## 📚 Referências

- [Git Secrets - Detection & Prevention](https://github.com/gitleaks/gitleaks)
- [git-filter-repo Documentation](https://htmlpreview.github.io/?https://github.com/newren/git-filter-repo/blob/docs/html/git-filter-repo.html)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Secrets Management](https://owasp.org/www-project-secret-management-cheat-sheet/)

---

**Status:** ✅ Histórico limpo | ⏳ Aguardando: Token rotacionado
