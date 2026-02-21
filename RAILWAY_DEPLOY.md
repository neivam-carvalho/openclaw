# 🚀 Railway Deploy - Passo-a-Passo Prático

**Status**: Código em GitHub ✅  
**Docker Image**: Buildado localmente (2.29GB) ✅  
**Próximo**: Conectar Railway + Deploy  

---

## 📋 Pré-requisitos (Antes de Começar)

### ✅ O que você já tem

- [x] Código em: https://github.com/neivam-carvalho/openclaw.git
- [x] Docker image pronto (`openclaw:latest`)
- [x] Credenciais locais: `.env.railway`
- [x] Config Railway: `railway.toml`

### ⏳ O que você precisa ter PRONTO

Antes de fazer deploy, certifique-se que criou:

- [ ] **Conta Railway** (https://railway.app)
  - Fazer login (recomendado com GitHub)
  - Ter acesso ao criar projetos

- [ ] **Anthropic API Key** 
  - Obtido em: https://console.anthropic.com
  - Formato: `sk-ant-...`
  - Salvo em local seguro

- [ ] **Telegram Bot Token**
  - Obtido via `@BotFather`
  - Formato: `123456:ABC-DEF...`
  - Salvo em local seguro

- [ ] **Domínio Customizado** (opcional mas recomendado)
  - Comprado em Namecheap, Google Domains, etc
  - Acesso ao DNS

---

## 🎯 5 Passos para Deploy na Railway

### **PASSO 1️⃣: Acessar Railway e Criar Projeto** (5 min)

1. Abra https://railway.app
2. Faça login (com GitHub ou email)
   ```
   Recomendado: GitHub
   - Click "Continue with GitHub"
   - Autorize Railway
   ```

3. **Criar novo projeto:**
   ```
   Dashboard → "New Project"
   Selecione: "Deploy from GitHub"
   ```

4. **Conectar GitHub:**
   ```
   Clique: "Connect GitHub"
   Autorize Railway com sua conta GitHub
   Selecione o repositório: "openclaw"
   ```

5. **Railway detectará automaticamente:**
   - [x] Dockerfile presente
   - [x] `.railway/config.toml` (se existir)
   - [x] Build iniciará automaticamente (~15 min)

**✅ Resultado**: Railway começará a fazer build do container

---

### **PASSO 2️⃣: Configurar Variáveis de Ambiente** (5 min)

Enquanto o build está rodando, configure as env vars:

1. **No Railway Dashboard:**
   ```
   [seu projeto] → "Settings" → "Variables"
   ```

2. **Adicione cada variável** (copie e cole os valores):

   ```
   Nome da Variável          Valor
   ─────────────────────────────────────────
   SETUP_PASSWORD            T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=
   
   OPENCLAW_GATEWAY_TOKEN    472eb1f41e0ae34a224eed25068364cfef4d083d839add95a9927bc422f9b5d7
   
   ANTHROPIC_API_KEY         sk-ant-<SUA-CHAVE-AQUI>
   
   TELEGRAM_BOT_TOKEN        <SEU-TOKEN-TELEGRAM>
   
   NODE_ENV                  production
   
   PORT                      8080
   
   OPENCLAW_STATE_DIR        /data
   
   OPENCLAW_WORKSPACE_DIR    /data/workspace
   ```

   **⚠️ IMPORTANTE:**
   - Valores entre `< >` = substitua com seus valores
   - Não coloque aspas (`"`) ao redor dos valores
   - Não coloque espaços extras
   - Clique "Save" após adicionar cada variável

3. **Verificar variáveis:**
   ```
   Dashboard → Variables
   Deve mostrar 8 variáveis listadas com valores mascarados
   ```

**✅ Resultado**: Todas as credenciais salvas no Railway

---

### **PASSO 3️⃣: Criar Volume de Persistência** (3 min)

OpenClaw precisa armazenar dados em `/data`:

1. **No Railway Dashboard:**
   ```
   [seu projeto] → "Storage"
   ```

2. **Criar volume:**
   ```
   Clique: "Add Volume"
   Mount Path: /data
   Size: 1GB (recomendado, mínimo)
   ```

3. **Confirmar:**
   ```
   Volume criado ✅
   Status: "Mounted"
   ```

**✅ Resultado**: Persistência de dados ativa

---

### **PASSO 4️⃣: Aguardar Build + Deploy** (15 min)

Railway fará automaticamente:

1. **Detectar o Dockerfile** ✓
2. **Build da imagem** (~10-15 min)
3. **Deploy em container** (~2-3 min)
4. **Iniciar service** ✓

**Monitorar progresso:**

```
Dashboard → [seu projeto] → "Deployments"
Veja a lista de builds com timestamps

Status esperado:
├─ "Building" (em azul) → aguarde
├─ "Deploying" (em amarelo) → quase pronto
└─ "Success" (em verde) ✅ → PRONTO!
```

**Ver logs em tempo real:**

```bash
# Se instalar Railway CLI (opcional):
npm install -g @railway/cli

# Login
railway login

# Ver logs
railway logs -p <seu-project-id>

# Buscar seu project ID:
railway projects
```

**Quando estiver pronto:**
```
Você receberá uma URL pública:
https://openclaw-xxxx.railway.app

✅ Gateway acessível!
```

---

### **PASSO 5️⃣: Testar Acesso** (2 min)

Quando o deploy estiver ✅ completo:

1. **Acessar Web UI via Railway domain:**
   ```
   https://openclaw-<seu-id>.railway.app/setup
   ```

2. **Entrar com a senha:**
   ```
   Password: T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=
   ```

3. **Se funcionar:**
   ```
   ✅ Gateway respondendo
   ✅ HTTPS ativo
   ✅ Credenciais corretas
   ```

**✅ Resultado**: OpenClaw acessível no Railway!

---

## 🌐 PASSO EXTRA: Configurar Domínio Customizado (5 min)

Se comprou domínio (recomendado):

### **Configurar no Railway:**

1. **Dashboard → [seu projeto] → "Settings" → "Domains"**

2. **Adicionar domínio customizado:**
   ```
   Clique: "Add Custom Domain"
   Escreva: seu-dominio.com
   ```

3. **Railway fornecerá CNAME:**
   ```
   Exemplo:
   CNAME: openclaw-xxxx.railway.app
   
   Guarde este valor!
   ```

### **Configurar no seu Registrador de Domínio:**

1. **Ir para DNS Management** (Namecheap, Google Domains, etc)

2. **Adicionar CNAME record:**
   ```
   Tipo:  CNAME
   Host:  @  (ou deixar em branco)
   Value: openclaw-xxxx.railway.app
   TTL:   3600 (padrão)
   ```

3. **Salvar**

4. **Aguardar propagação DNS:**
   ```
   Tipicamente: 15-30 minutos
   
   Testar:
   $ dig seu-dominio.com CNAME
   
   Ou: https://dnschecker.org
   ```

### **HTTPS Automático:**

Railway ativa HTTPS automaticamente via Let's Encrypt!

```
Após DNS propagar:
https://seu-dominio.com/setup  ✅ HTTPS ativo
```

---

## ✅ Checklist - Status do Deploy

- [ ] Repositório em GitHub (neivam-carvalho/openclaw)
- [ ] Conta Railway criada e logado
- [ ] Novo projeto criado no Railway
- [ ] GitHub conectado ao Railway
- [ ] 8 variáveis de ambiente configuradas
- [ ] Volume `/data` criado com 1GB+
- [ ] Build completado com ✅
- [ ] Deploy completo com ✅
- [ ] Acessível em: `https://openclaw-xxxx.railway.app`
- [ ] Domínio customizado apontando (se comprou)
- [ ] HTTPS funcionando

---

## 🚨 Troubleshooting Rápido

### Build falha

```
Erro: "Build failed"

Solução:
1. Ver logs: railway logs -p <project-id>
2. Procurar por: npm ERR! ou Docker error
3. Verificar se node_modules corrompido
4. Fazer rebuild: Dashboard → Redeploy
```

### Variáveis não salvam

```
Erro: "Variable failed to save"

Solução:
1. Verificar valores grandes (> 10KB)
2. Remover espaços extras no final
3. Não usar aspas ao redor de valores
4. Tentar novamente
```

### Deploy vazio (sem rodar)

```
Erro: Container inicia mas não roda gateway

Solução:
1. Verificar se PORT=8080 está setado
2. Verificar logs: railway logs
3. Confirmar SETUP_PASSWORD correto
4. Confirmar se volume /data foi criado
```

### Gateway não responde

```
Erro: https://seu-dominio.com retorna 502

Solução:
1. Aguardar mais tempo (~5 min)
2. Verificar health check: railway status
3. Ver logs para erro de startup
4. Confirmar PORT=8080 nas variables
```

### DNS não propagou

```
Erro: seu-dominio.com não resolve

Solução:
1. Aguardar até 30 min
2. Verificar CNAME está correto: dig seu-dominio.com CNAME
3. Limpar cache: flush DNS no seu OS
4. Testar em outro DNS: nslookup seu-dominio.com 8.8.8.8
```

---

## 📊 Cronograma Expected

| Fase | Tempo | Atividade |
|------|-------|----------|
| 1 | 5 min | Criar projeto Railway + conectar GitHub |
| 2 | 5 min | Configurar 8 variáveis |
| 3 | 3 min | Criar volume `/data` |
| 4 | 15 min | Build + Deploy automático |
| 5 | 2 min | Testar acesso |
| **Domínio Extra** | 5+30 min | Config DNS + propagação |
| **TOTAL** | ~30-35 min | Gateway online! |

---

## 🎯 Resumo do Deploy

```
Fluxo Automático do Railway:

1. GitHub push
    ↓
2. Railway detecta novo commit
    ↓
3. Railway lê railway.toml
    ↓
4. Railway faz docker build (automaticamente!)
    ↓
5. Railway cria container
    ↓
6. Railway injeta env vars
    ↓
7. Railway monta volume /data
    ↓
8. Railway inicia container
    ↓
9. OpenClaw gateway inicia
    ↓
10. ✅ Acessível em HTTPS!
```

---

## 🔒 Segurança - Reminders

✅ **Implementado**:
- Dockerfile roda como non-root
- Env vars em Railway (não em git)
- `.env.railway` protegido (.gitignore)
- HTTPS automático

✅ **Você deve fazer**:
- ✓ NÃO compartilhar ANTHROPIC_API_KEY
- ✓ NÃO compartilhar TELEGRAM_BOT_TOKEN
- ✓ Usar domínio customizado (mais seguro)
- ✓ Ativar 2FA no Anthropic quando possível

---

## 📚 Referencias

- **Railway Docs**: https://docs.railway.app
- **Railway GitHub Deploy**: https://docs.railway.app/deploy/github
- **OpenClaw Docs**: https://docs.openclaw.ai
- **Railway CLI**: `npm install -g @railway/cli`

---

## ✨ Próximas Ações Após Deploy

Depois que OpenClaw estiver online no Railway:

**Fase 6: Onboarding (Fase 6)**
1. Acessar: `https://seu-dominio.com/setup`
2. Entrar com password
3. Configurar modelo, channels, etc

**Fase 7: Testes**
1. Enviar mensagem no Telegram ao bot
2. Receber resposta do Claude
3. Explorar funcionalidades

---

**AGORA**: Seguir os 5 passos acima no Railway Dashboard! 🚀

Tempo estimado: **30-35 minutos** até OpenClaw online

