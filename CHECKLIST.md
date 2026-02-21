# ✅ Checklist - OpenClaw Railway Setup

## ✅ Completado (No meu Setup)

### Fase 1: Preparação ✅
- [x] Repositório OpenClaw clonado (`~/Dropbox/16_tools/openclaw`)
- [x] Credenciais geradas com OpenSSL
  - [x] SETUP_PASSWORD = `T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=`
  - [x] OPENCLAW_GATEWAY_TOKEN = `472eb1f41e0ae34a224eed25068364cfef4d083d839add95a9927bc422f9b5d7`
- [x] Arquivo `.env.railway` criado
- [x] `.gitignore` atualizado

### Fase 2: Repositório Local ✅
- [x] Node.js verificado (23.6.1, >= 22.12.0 ✓)
- [x] npm verificado (10.9.2)
- [x] Docker verificado (27.4.0)
- [x] `npm install` completo (816 pacotes)
- [x] Estrutura validada

### Fase 3: Configuração Railway ✅
- [x] `railway.toml` criado
- [x] `deploy.sh` criado e executável
- [x] Documentação completa:
  - [x] IMPLEMENTATION_COMPLETE.md
  - [x] SETUP_MANUAL.md
  - [x] QUICK_START.md
  - [x] README_RAILWAY_SETUP.md
  - [x] NAVIGATION_MAP.md

---

## ⏳ TODO (Você Fazer)

### Próxima Ação: Fase A - Criar Contas (20-30 min)

**Arquivo guia**: [SETUP_MANUAL.md](SETUP_MANUAL.md)

- [ ] **1. Criar conta Railway**
  - [ ] Ir para https://railway.app
  - [ ] Sign up com GitHub (recomendado)
  - [ ] Criar novo projeto (deixar em branco)
  - [ ] Guardar Project ID

- [ ] **2. Gerar Anthropic API Key**
  - [ ] Ir para https://console.anthropic.com
  - [ ] Sign up e verificar email
  - [ ] Ir a "API keys"
  - [ ] Gerar nova key
  - [ ] Guardar: `sk-ant-...`

- [ ] **3. Criar Telegram Bot**
  - [ ] Abrir Telegram (instalar se necessário)
  - [ ] Procurar `@BotFather`
  - [ ] Enviar `/newbot`
  - [ ] Responder perguntas
  - [ ] Guardar bot token

- [ ] **4. Domínio Customizado** (opcional mas recomendado)
  - [ ] Comprar em Namecheap, Google, Cloudflare
  - [ ] Guardar nome: `seu-dominio.com`
  - [ ] Guardar login do registrador

### Próxima Ação: Fase B - Build Docker (15 min)

**Quando**: Após Fase A

```bash
cd ~/Dropbox/16_tools/openclaw
./deploy.sh
# Escolha opção 1 ou 4
```

- [ ] Docker image `openclaw:latest` buildado com sucesso
- [ ] Arquivo `deploy.sh` rodou sem erros

### Próxima Ação: Fase C - Deploy Railway (20 min)

**Arquivo guia**: [QUICK_START.md](QUICK_START.md) Fases 4-5

- [ ] Push para GitHub
  ```bash
  git remote add origin https://github.com/seu-usuario/openclaw.git
  git push -u origin main
  ```

- [ ] Conectar Railway ao GitHub
  - [ ] Railway Dashboard → Deploy from GitHub
  - [ ] Autorizar GitHub
  - [ ] Selecionar repositório

- [ ] Configurar Variáveis Railway
  ```
  SETUP_PASSWORD = T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=
  OPENCLAW_GATEWAY_TOKEN = 472eb1f41e0ae34a224eed25068364cfef4d083d839add95a9927bc422f9b5d7
  ANTHROPIC_API_KEY = sk-ant-<sua-chave>
  TELEGRAM_BOT_TOKEN = <seu-token>
  NODE_ENV = production
  PORT = 8080
  OPENCLAW_STATE_DIR = /data
  OPENCLAW_WORKSPACE_DIR = /data/workspace
  ```

- [ ] Criar Volume `/data`
  - [ ] Railway Dashboard → Storage
  - [ ] Add Volume → mount path `/data` → 1GB

- [ ] Deploy bem-sucedido
  - [ ] Status ✅ no Railway Dashboard
  - [ ] Domain fornecido (ex: `openclaw-xxxx.railway.app`)

### Próxima Ação: Fase D - Domínio Customizado (5 min)

**Se comprou domínio**:

- [ ] No Railway Dashboard:
  - [ ] [seu projeto] → Settings → Domains
  - [ ] "Custom Domain"

- [ ] No seu registrador de domínio:
  - [ ] DNS Management
  - [ ] Adicionar CNAME:
    ```
    Name: @
    Value: <railway-domain-fornecido>
    ```

- [ ] Aguardar propagação DNS (~15-30 min)

### Próxima Ação: Fase E - Onboarding (10 min)

**Arquivo guia**: [QUICK_START.md](QUICK_START.md) Fase 6

1. [ ] Abrir: `https://seu-dominio.com/setup`
2. [ ] Entrar com password: `T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=`
3. [ ] Configurar Model:
   - [ ] Provider: Anthropic
   - [ ] API Key: `sk-ant-...`
   - [ ] Model: Claude 3.5 Sonnet
4. [ ] Ativar Extensions:
   - [ ] Email
   - [ ] Browser Control
   - [ ] Web Search
   - [ ] Memory
5. [ ] Adicionar Telegram Bot:
   - [ ] Token: `<seu-token>`
6. [ ] Salvar configuração

### Próxima Ação: Fase F - Testes (5 min)

**Arquivo guia**: [QUICK_START.md](QUICK_START.md) Fase 7

- [ ] Acessar Web UI: `https://seu-dominio.com/openclaw`
- [ ] Enviar mensagem no Telegram ao seu bot
- [ ] Receber resposta do Claude (sucesso!)
- [ ] Verificar logs:
  ```bash
  railway logs -p <seu-project-id>
  ```

---

## 📊 Timeline

| Fase | Tempo | Status |
|------|-------|--------|
| A: Criar contas | 20-30 min | ⏳ Fazer |
| B: Build Docker | 15 min | ⏳ Fazer |
| C: Deploy Railway | 20 min | ⏳ Fazer |
| D: Domínio | 5 min | ⏳ Fazer |
| E: Onboarding | 10 min | ⏳ Fazer |
| F: Testes | 5 min | ⏳ Fazer |
| **TOTAL** | **~90 min** | 🚀 |

---

## 🔐 Segurança - Responsabilidades

### Minha Responsabilidade (Completa ✅):
- [x] Separar código de credenciais
- [x] Proteger .env.railway de git
- [x] Gerar senhas fortes (OpenSSL)
- [x] Configurar Dockerfile com non-root
- [x] Documentar boas práticas
- [x] Preparar railway.toml para deploy seguro

### Sua Responsabilidade (Fazer ⏳):
- [ ] Guardar credenciais em password manager
- [ ] NÃO commitar `.env.railway` em git
- [ ] NÃO compartilhar ANTHROPIC_API_KEY
- [ ] NÃO compartilhar TELEGRAM_BOT_TOKEN
- [ ] Usar HTTPS (Railway fornece)
- [ ] Usar domínio customizado (não public)
- [ ] Rotacionar credenciais a cada 6 meses

---

## 📚 Referência Rápida

| Preciso... | Arquivo |
|-----------|---------|
| Entender o que foi feito | IMPLEMENTATION_COMPLETE.md |
| Criar contas online | SETUP_MANUAL.md |
| Guia passo-a-passo completo | QUICK_START.md |
| Referência técnica | README_RAILWAY_SETUP.md |
| Navegar entre documentos | NAVIGATION_MAP.md |
| Build Docker | ./deploy.sh |

---

## 🚀 Comece Agora!

```bash
# Passo 1: Leia documentação
cat IMPLEMENTATION_COMPLETE.md

# Passo 2: Siga guia de contas
cat SETUP_MANUAL.md

# Passo 3: Crie 4 contas (20-30 min online)

# Passo 4: Build Docker
./deploy.sh

# Passo 5: Siga QUICK_START.md para Railway
cat QUICK_START.md
```

**Tempo total até OpenClaw rodando: ~90 minutos!**

---

**Status**: ✅ Setup pronto. Próximo: Criar contas em SETUP_MANUAL.md

