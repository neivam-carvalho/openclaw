# 🚀 OpenClaw Railway - Quick Start Guide

**Status**: Pronto para deploy  
**Data**: 2026-02-21  
**Objetivo**: Deploy seguro de OpenClaw em Railway com domínio customizado e HTTPS

---

## 📋 Pré-requisitos (Antes de Começar)

### Contas Necessárias

Crie essas contas (veja [SETUP_MANUAL.md](SETUP_MANUAL.md) para detalhes):

- [ ] **Railway** (hospedagem na nuvem)
- [ ] **Anthropic** (API Claude - modelo de IA)
- [ ] **Telegram** (@BotFather - canal de comunicação)
- [ ] **Domínio customizado** (opcional, mas recomendado)

### Credenciais Geradas

Localmente, você tem em `.env.railway`:
```bash
SETUP_PASSWORD=T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=
OPENCLAW_GATEWAY_TOKEN=472eb1f41e0ae34a224eed25068364cfef4d083d839add95a9927bc422f9b5d7
```

### Ambiente Local

✅ Node.js 23.6.1 (>= 22.12.0)  
✅ npm 10.9.2  
✅ Docker 27.4.0  
✅ Repositório clonado  
✅ `npm install` completado  

---

## 🎯 Fases de Implementação

### **Fase 1: Preparação de Contas** ✅ COMPLETA

- [x] Gerar credenciais seguras localmente
- [x] Criar arquivo `.env.railway` (não commitado)
- [x] Documentação de contas criada ([SETUP_MANUAL.md](SETUP_MANUAL.md))

**Próximo passo**: Você criar as 4 contas listadas em [SETUP_MANUAL.md](SETUP_MANUAL.md)

---

### **Fase 2: Preparar Repositório Localmente** ✅ COMPLETA

- [x] Clonar https://github.com/openclaw/openclaw.git
- [x] Node.js validado (23.6.1)
- [x] `npm install` completado (816 pacotes)
- [x] Arquivo `.env.railway` com credenciais

**Status**: Repositório pronto para build Docker

---

### **Fase 3: Validar e Testar Dockerfile** 🔄 EM PROGRESSO

**O que será feito**:
- [ ] Build imagem Docker `openclaw:latest`
- [ ] Validar Dockerfile para Railway
- [ ] Testar saída (opcional, localmente)

**Estimado**: ~15 minutos (build em andamento)

**Próximo passo**: Aguardar conclusão do build Docker

---

### **Fase 4: Deploy na Railway via GitHub** ⏳ PRÓXIMA

**Passos**:
1. Fazer push do código para seu GitHub (se privado, melhor)
   ```bash
   git remote add origin https://github.com/seu-usuario/openclaw.git
   git branch -M main
   git push -u origin main
   ```

2. Conectar Railway ao seu repositório GitHub
   - Railway.app → New Project → Deploy from GitHub
   - Autorizar Railway com GitHub
   - Selecionar repositório `openclaw`

3. Configurar variáveis de ambiente no Railway
   ```
   SETUP_PASSWORD=<seu-valor>
   OPENCLAW_GATEWAY_TOKEN=<seu-valor>
   ANTHROPIC_API_KEY=sk-ant-<sua-chave>
   TELEGRAM_BOT_TOKEN=<seu-token>
   NODE_ENV=production
   PORT=8080
   OPENCLAW_STATE_DIR=/data
   OPENCLAW_WORKSPACE_DIR=/data/workspace
   ```

4. Criar Volume de Persistência
   ```
   Railway → Storage → Add Volume
   Mount path: /data
   Size: 1GB+
   ```

5. Deploy automático (Railway detectará Dockerfile)

**Estimado**: ~20 minutos (15 min build + 5 min setup)

---

### **Fase 5: Configurar Domínio Customizado + HTTPS** ⏳ PRÓXIMA

**Se comprou domínio** (ex: meuopenclaw.com):

1. No Railway Dashboard:
   ```
   [seu projeto] → Settings → Domains
   Clique: "Custom Domain"
   ```

2. Adicionar CNAME em seu registrador de domínio:
   ```
   Name: @
   Value: <seu-domain-railway.app>
   ```

3. Aguardar propagação DNS (~15-30 min)

4. HTTPS automático (Railway via Let's Encrypt)

**Se sem domínio customizado**:
- Railway fornece: `seuapp-openclaw.railway.app` (com HTTPS automático)
- Menos seguro, mas funciona

---

### **Fase 6: Onboarding Wizard** ⏳ PRÓXIMA

Após deploy bem-sucedido:

1. Acessar setup wizard:
   ```
   https://seu-dominio.com/setup
   ```

2. Entrar com `SETUP_PASSWORD`

3. Configurar:
   - **Model Provider**: Anthropic
   - **API Key**: `ANTHROPIC_API_KEY`
   - **Model**: Claude 3.5 Sonnet (melhor custo-benefício)

4. Ativar Extensions:
   - ✅ Email (processar emails)
   - ✅ Browser Control (automação)
   - ✅ Web Search (pesquisa)
   - ✅ Memory (embeddings)

5. Configurar Canal Telegram:
   - Selecionar "Telegram" 
   - Colar `TELEGRAM_BOT_TOKEN`
   - Confirmar

6. Salvar e finalizar

---

### **Fase 7: Testar e Validar** ⏳ PRÓXIMA

1. **Acessar Web UI**:
   ```
   https://seu-dominio.com/openclaw
   ```

2. **Testar Telegram**:
   - Abrir Telegram
   - Procurar seu bot (ex: @openclaw_mybot)
   - Enviar mensagem: "Olá!"
   - Aguardar resposta (Claude)

3. **Verificar Logs**:
   ```bash
   railway logs --project <seu-project-id>
   ```

4. **Testar Funcionalidades**:
   - [ ] Gateway respondendo em HTTPS
   - [ ] Telegram enviando/recebendo
   - [ ] Claude API funcionando
   - [ ] Domínio customizado resolvendo
   - [ ] Credenciais funcionando

---

## 📊 Checklist Final

### Antes do Deploy

- [ ] Railway conta criada
- [ ] Anthropic API key gerada
- [ ] Telegram bot criado
- [ ] Domínio comprado/configurado (opcional)
- [ ] `.env.railway` com credenciais
- [ ] Docker build completo (`openclaw:latest`)
- [ ] Repositório em GitHub (público ou privado)

### Após Deploy

- [ ] Variáveis de ambiente setadas no Railway
- [ ] Volume `/data` criado
- [ ] Deploy bem-sucedido (status ✅)
- [ ] Domínio customizado apontando
- [ ] Onboarding wizard acessível
- [ ] Telegram bot respondendo
- [ ] Logs sem erros críticos

---

## 🔗 Recursos

- **OpenClaw Docs**: https://docs.openclaw.ai
- **OpenClaw GitHub**: https://github.com/openclaw/openclaw
- **Railway Docs**: https://docs.railway.app
- **Anthropic Console**: https://console.anthropic.com
- **Telegram BotFather**: @BotFather no Telegram

---

## ⏱️ Cronograma Total

| Fase | Duração | Status |
|------|---------|--------|
| 1. Preparação contas | 20-30 min | ✅ Documentado |
| 2. Repositório local | 5 min | ✅ Completo |
| 3. Dockerfile | ~15 min | 🔄 Em progresso |
| 4. Deploy Railway | 20 min | ⏳ Próximo |
| 5. Domínio + HTTPS | 5 min | ⏳ Próximo |
| 6. Onboarding | 10 min | ⏳ Próximo |
| 7. Testes | 5 min | ⏳ Próximo |
| **TOTAL** | **~90 min** | - |

---

## 🆘 Troubleshooting

### Docker build falhando

```bash
# Limpar cache Docker
docker system prune -a

# Retry com verbose
docker build -t openclaw:latest -f Dockerfile . --progress=plain
```

### Railway deploy lento

- Aguardar ~10 min
- Verificar se volume `/data` foi criado
- Checar logs no Railway Dashboard

### Telegram não respondendo

- Verificar se bot token está correto
- Confirmar se foi feito `/setup` com sucesso
- Verificar logs de erro em Railway

### Domínio não resolvendo

- Aguardar propagação DNS (~30 min)
- Verificar CNAME record: `dig seu-dominio.com CNAME`
- Railway precisa de domínio "verified" (esperar confirmação)

---

## 🔒 Segurança

### Best Practices Implementadas

✅ Dockerfile roda como non-root (`USER node`)  
✅ HTTPS automático (Let's Encrypt)  
✅ Credenciais armazenadas em Railway env var (não em `.env`)  
✅ `.env.railway` excluído de git  
✅ Token autenticação longo (hex 32)  
✅ Senha setup longo (base64 32)  

### O que você DEVE fazer

- [ ] Não compartilhar ANTHROPIC_API_KEY
- [ ] Não compartilhar TELEGRAM_BOT_TOKEN
- [ ] Não logar em Railway com conta pessoal exposta
- [ ] Rotacionar credenciais a cada 6 meses
- [ ] Usar 2FA no Anthropic (quando disponível)
- [ ] Manter Railway conectado apenas com GitHub

---

## 📝 Próximos Passos

1. **Agora**: Aguardar conclusão do build Docker (Fase 3)
2. **Depois**: Seguir [Fase 4](#fase-4-deploy-na-railway-via-github) (Deploy Railway)
3. **Próximo**: Completar onboarding wizard (Fase 6)
4. **Teste**: Usar Telegram para conversar com Claude

---

**Última atualização**: 2026-02-21  
**Versão**: 1.0  
**Status**: Pronto para começar! 🚀
