# 🦞 OpenClaw Railway Setup

> Repositório configurado para deploy seguro de OpenClaw em Railway  
> com máxima segurança e separação total da máquina local

**Status**: ✅ Pronto para Railway  
**Versão OpenClaw**: 2026.2.21  
**Data Setup**: 2026-02-21  

---

## 📁 Arquivos de Setup Criados

### Documentação

| Arquivo | Propósito |
|---------|----------|
| [QUICK_START.md](QUICK_START.md) | Guia passo a passo do deployment |
| [SETUP_MANUAL.md](SETUP_MANUAL.md) | Criar contas e credenciais |
| **Este arquivo** | Referência geral |

### Configuração

| Arquivo | Propósito |
|---------|----------|
| [railway.toml](railway.toml) | Configuração do Railway (build + deploy) |
| [.env.railway](.env.railway) | Credenciais locais (⚠️ não commitar) |
| [deploy.sh](deploy.sh) | Script para facilitar setup |

### Modificações

| Arquivo | Mudança |
|---------|---------|
| `.gitignore` | Adicionado `.env.railway` e `*.env.local` |
| `Dockerfile` | Original (sem mudanças) |
| `docker-compose.yml` | Original (para referência local) |

---

## 🚀 Quick Start (3 Passos)

### 1️⃣ Criar Contas Online

Siga [SETUP_MANUAL.md](SETUP_MANUAL.md):
- [ ] Railway
- [ ] Anthropic (Claude API)
- [ ] Telegram Bot
- [ ] Domínio (opcional)

⏱️ **Tempo**: ~20-30 min

### 2️⃣ Buildar Docker Image

```bash
cd ~/Dropbox/16_tools/openclaw
./deploy.sh
# Ou manualmente:
# docker build -t openclaw:latest -f Dockerfile .
```

⏱️ **Tempo**: ~15 min

### 3️⃣ Deploy no Railway

Siga [QUICK_START.md](QUICK_START.md) Fase 4-7:

1. Push para GitHub
2. Conectar Railway ao GitHub
3. Configurar env vars no Railway
4. Aguardar deploy
5. Onboarding wizard
6. Teste com Telegram

⏱️ **Tempo total**: ~1 hora

---

## 📋 Arquitetura

```
┌─────────────────────────────────────────────────────┐
│ Sua Máquina Local (Dropbox/16_tools/openclaw)      │
├─────────────────────────────────────────────────────┤
│ ✅ Node.js 23.6.1                                   │
│ ✅ npm install (816 pacotes)                        │
│ ✅ Docker 27.4.0                                    │
│ ✅ .env.railway (credenciais locais)               │
│ ⚠️  NÃO está rodando OpenClaw ainda!                │
└──────────────────┬──────────────────────────────────┘
                   │ git push
                   ▼
┌─────────────────────────────────────────────────────┐
│ GitHub Repository (seu-usuario/openclaw)           │
├─────────────────────────────────────────────────────┤
│ ✅ Código clonado                                   │
│ ✅ railway.toml                                     │
│ ✅ Dockerfile                                       │
│ ⚠️  .env.railway NÃO commitado (seguro!)            │
└──────────────────┬──────────────────────────────────┘
                   │ Railway detects Dockerfile
                   ▼
┌─────────────────────────────────────────────────────┐
│ Railway Cloud (Hospedagem em Produção)              │
├─────────────────────────────────────────────────────┤
│ 🐳 Docker Container (Node.js)                       │
│ 📦 Volume /data (persistência)                      │
│ 🔐 Env vars: SETUP_PASSWORD, API KEYS, etc         │
│ 🌐 HTTPS automático (Let's Encrypt)                │
│ 🎯 Acesso via: https://seu-dominio.com             │
└─────────────────────────────────────────────────────┘
         │
         ├─► Gateway (porta 8080 → 18789)
         │   Responde em https://seu-dominio.com
         │
         └─► Telegram Bot
             Conecta ao TELEGRAM_BOT_TOKEN
             Responde com Claude (ANTHROPIC_API_KEY)
```

---

## 🔒 Segurança - Como Funciona

### Separação de Ambiente

| Aspecto | Local | Railway | Benefício |
|---------|-------|---------|-----------|
| **Dados** | ~/.openclaw (local) | /data (volume) | Isolado |
| **Credenciais** | .env.railway (local) | Env vars (Railway) | Não em git |
| **Acesso** | Loopback (127.0.0.1) | HTTPS público | Seguro |
| **Autenticação** | Token local | Senha setup | Múltiplas camadas |

### Fluxo de Credenciais

```
┌──────────────────────────┐
│ Suas Credenciais Locais  │
│ (seu computador)         │
│                          │
│ .env.railway            │
│ ├─ SETUP_PASSWORD        │
│ ├─ GATEWAY_TOKEN         │
│ ├─ API_KEY (quando pronto) │
│ └─ BOT_TOKEN (quando pronto) │
└──────────────────┬───────┘
                   │ ⚠️ NÃO commitar
                   │
         ┌─────────▼──────────┐
         │ Você copia valores │
         │ para Railway       │
         │ Dashboard UI       │
         └─────────┬──────────┘
                   │ Encriptado em trânsito (Railway)
                   │
         ┌─────────▼──────────────────┐
         │ Railway Env Vars (Seguro)  │
         │ (em máquina na nuvem)      │
         │                            │
         │ SETUP_PASSWORD=***         │
         │ GATEWAY_TOKEN=***          │
         │ ANTHROPIC_API_KEY=***      │
         │ TELEGRAM_BOT_TOKEN=***     │
         └────────────────────────────┘
```

### Fluxo de Dados

```
Telegram User          OpenClaw Gateway       Claude API
    │                       │                     │
    ├─ "Hello" ────────────►│                     │
    │                       ├─ Envia mensagem ──►│
    │                       │                     │
    │                       │◄─ Resposta ────────┤
    │◄──── "Hi there!" ────┤                     │
    │                       │   (Seguro via HTTPS)
    │                       │
    │                    /data/workspace
    │                   (memória OpenClaw)
    │                   (no Railway, isolado)
```

---

## 📚 Documentos Principais

### 1. SETUP_MANUAL.md
**Para**: Criar as 4 contas necessárias  
**Contém**:
- Como criar conta Railway
- Como gerar API key Anthropic
- Como criar Telegram bot
- Como comprar/configurar domínio

### 2. QUICK_START.md  
**Para**: Guia passo-a-passo completo  
**Contém**:
- Checklist pré-requisitos
- 7 fases de implementação
- Troubleshooting
- Cronograma (90 min total)

### 3. railway.toml
**Para**: Configurar Railway  
**Contém**:
- Build args
- Environment variables
- Health checks
- Logging

### 4. deploy.sh
**Para**: Facilitar build Docker  
**Uso**:
```bash
./deploy.sh
# Menu interativo com opções
```

---

## ✅ Checklist - Pronto para Começar

### Setup Concluído
- [x] Repositório clonado
- [x] npm install completo
- [x] Docker validado
- [x] Credenciais geradas
- [x] .env.railway criado
- [x] railway.toml criado
- [x] Documentação completa
- [x] deploy.sh criado

### Você Precisa Fazer
- [ ] Criar conta Railway
- [ ] Gerar Anthropic API key
- [ ] Criar Telegram bot
- [ ] Comprar domínio (opcional mas recomendado)
- [ ] Rodar `./deploy.sh` para buildar Docker
- [ ] Fazer push para GitHub
- [ ] Conectar Railway ao GitHub
- [ ] Configurar env vars no Railway
- [ ] Executar onboarding wizard

---

## 🎓 Comandos Úteis

### Build Docker Local
```bash
cd ~/Dropbox/16_tools/openclaw
docker build -t openclaw:latest -f Dockerfile .

# Com mais output
docker build -t openclaw:latest -f Dockerfile . --progress=plain
```

### Testar Localmente
```bash
docker run -it --rm -p 8080:18789 \
  -e SETUP_PASSWORD="T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=" \
  -e OPENCLAW_GATEWAY_TOKEN="472eb1f41e0ae34a224eed25068364cfef4d083d839add95a9927bc422f9b5d7" \
  -e NODE_ENV=production \
  openclaw:latest
```

### Ver Credenciais (arquivo local)
```bash
cat ~/.../openclaw/.env.railway | grep -v '^#'
```

### Railway CLI
```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Logs
railway logs -p <project-id>

# Deploy status
railway status
```

---

## 🚨 Coisas que NÃO FAZER

❌ Commitar `.env.railway` no git  
❌ Compartilhar ANTHROPIC_API_KEY em Slack/Email  
❌ Usar TELEGRAM_BOT_TOKEN em código  
❌ Deixar credentials em comentários  
❌ Usar Railway domain público no lugar de domínio customizado  
❌ Rodar OpenClaw em loopback quando precisa de acesso remoto  

---

## 📞 Suporte

### Se algo der errado

1. **Verificar logs**:
   ```bash
   railway logs -p <project-id>
   ```

2. **Conferir variáveis**:
   - Railway Dashboard → Settings → Variables
   - Confirmar se SETUP_PASSWORD está correto

3. **Testar domínio**:
   ```bash
   dig seu-dominio.com
   curl -v https://seu-dominio.com/health
   ```

4. **Comunidades**:
   - [OpenClaw Discord](https://discord.gg/qkhbAGHRBT)
   - [Railway Discord](https://discord.gg/railway)

### Documentações Oficiais

- [Railway Docs](https://docs.railway.app)
- [OpenClaw Docs](https://docs.openclaw.ai)
- [Docker Docs](https://docs.docker.com)
- [Node.js Docs](https://nodejs.org/docs)

---

## 📊 Status Current

| Componente | Status | Versão |
|-----------|--------|--------|
| OpenClaw Code | ✅ Clonado | 2026.2.21 |
| Node.js | ✅ Instalado | 23.6.1 |
| Docker | ✅ Pronto | 27.4.0 |
| npm packages | ✅ Installed | 816 |
| Railway Config | ✅ Criado | railway.toml |
| Credenciais | ✅ Geradas | .env.railway |
| Documentação | ✅ Completa | 3 arquivos |
| **Próximo** | ⏳ Build Docker | ./deploy.sh |

---

## 🎯 Próximos Passos

1. **Leia**: [SETUP_MANUAL.md](SETUP_MANUAL.md) (criar contas)
2. **Execute**: `./deploy.sh` (build Docker)  
3. **Siga**: [QUICK_START.md](QUICK_START.md) (deploy Railway)
4. **Teste**: Telegram → Claude responses

---

## 📝 Notas Especiais

### Por que não commitar credenciais?

Mesmo repositórios privados podem vazar:
- Desenvolvedor deixa acesso público por erro
- GitHub enterprise é hackeado
- Revisor de código compartilha com terceiro

**Solução**: Credenciais sempre vão para Railway env vars (não git).

### Por que Railway?

- ✅ Deploy automático via Dockerfile
- ✅ HTTPS automático (Let's Encrypt)
- ✅ Volumes para persistência
- ✅ Scaling automático
- ✅ Logging nativo
- ✅ Integração GitHub nativa
- ✅ Barato para uso pessoal
- ✅ Suporta múltiplos serviços

### Por que Telegram?

- ✅ Bot framework simples
- ✅ Sem servidor necessário
- ✅ Webhook push (não polling)
- ✅ Telegram é seguro (TLS)
- ✅ API gratuita
- ✅ Possibilidade de usar web.telegram.org depois

---

## 📄 Licença

OpenClaw é open source. Veja [LICENSE](LICENSE) para detalhes.

Este setup segue as melhores práticas de segurança do OpenClaw.

---

**Status Final**: ✅ Tudo preparado. Próximo passo: Executar `./deploy.sh` 🚀

