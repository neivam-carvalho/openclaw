# 📋 OpenClaw Railway Setup - Contas e Credenciais Manuais

> Este documento lista as contas e credenciais que VOCÊ precisa criar manualmente antes do deploy

## ✅ Checklist de Contas

### 1. **Conta Railway** (Plataforma de Hospedagem)

**Status**: ⬜ Não iniciado

```
Ir para: https://railway.app
1. Clique em "Log in" ou "Sign up"
2. Escolha autenticação:
   - GitHub (recomendado)
   - Email + password
   - Google, Gitlab, etc.
3. Verificar email (se usar email login)
4. Criar novo projeto:
   - Dashboard → New Project
   - Escolher "Deploy from GitHub" (vamos integrar depois)
   - Ou vazio (adicionar repo depois)
5. Salvar seu PROJECT_ID (será usado nos próximos passos)
```

**Credenciais a guardar**:
- [ ] Username/Email do Railway
- [ ] Password (se não usar GitHub)
- [ ] Project ID: `_________________________`
- [ ] Railway API Token (opcional, para CLI): `_________________________`

---

### 2. **Anthropic API Key** (Modelo Claude)

**Status**: ⬜ Não iniciado

```
Ir para: https://console.anthropic.com
1. Clique em "Sign up" com email pessoal
2. Verificar email
3. Ir para "API Keys": https://console.anthropic.com/account/keys
4. Clique em "Create Key"
5. Nomeie como "OpenClaw Railway"
6. Copiar a chave (formato: sk-ant-...)
   ⚠️ Só aparece uma vez! Guardar em local seguro
```

**Credenciais a guardar**:
- [ ] Email Anthropic: `_________________________`
- [ ] ANTHROPIC_API_KEY: `sk-ant-______________________`

**Bilhetagem**:
- Acesso ao plano gratuito inicial $5 de crédito
- Depois, você ativa billing (cartão de crédito)
- Custo típico: ~$0.10-1 por dia (dependendo de uso)

---

### 3. **Telegram Bot Token** (Canal de Comunicação)

**Status**: ⬜ Não iniciado

```
1. Abrir Telegram Desktop ou App (instalar se não tiver)
   https://telegram.org

2. Procurar por: @BotFather

3. Enviar comando: /newbot

4. Seguir as perguntas:
   - Nome do bot: ex "OpenClaw Assistant"
   - Username único: ex "@openclaw_mybot" (deve terminar com _bot)
   - BotFather retorna token

5. Copiar o token (formato: 123456:ABC-DEFghi...)
   
6. (Opcional) Personalizar bot:
   - /setdescription → descrição do bot
   - /setuserpic → foto (webclaw mascot?)
   - /setcommands → lista de comandos
```

**Credenciais a guardar**:
- [ ] Telegram Username: `_________________________`
- [ ] Bot Username: `@_________________________`
- [ ] TELEGRAM_BOT_TOKEN: `_________________________`

**Como testar**:
```
1. Procurar seu bot no Telegram (ex: @openclaw_mybot)
2. Clicar em "Start"
3. Enviar mensagem: "Olá"
4. OpenClaw responderá com Claude (depois do setup)
```

---

### 4. **Domínio Customizado** (Acesso HTTPS seguro)

**Status**: ⬜ Não iniciado

**Opção A: Comprar novo domínio (recomendado)**

```
Registradores populares:
- Namecheap: https://namecheap.com (barato, bom support)
- Google Domains: https://domains.google.com
- Cloudflare: https://cloudflare.com (registrar + DNS)
- 1&1: https://1and1.com

Passos:
1. Ir ao site do registrador
2. Procurar por domínio (ex: "meuopenclaw.com")
3. Verificar preço (típico: $5-15/ano para .com)
4. Comprar e confirmar (pagamento com cartão)
5. Aguardar confirmação de email
6. Ir para DNS Management
7. Adicionar CNAME record (na próxima fase)
```

**Opção B: Usar domínio existente**

```
Se já tem domínio:
1. Ir ao painel de controle (onde registrou)
2. Buscar "DNS" ou "DNS Management"
3. Estará pronto para adicionar records na próxima fase
```

**Credenciais a guardar**:
- [ ] Domínio: `___________________________.com`
- [ ] Registrador: `_________________________`
- [ ] Email de acesso: `_________________________`
- [ ] Senha (em password manager): `_________________________`

---

## 📦 Credenciais Já Geradas

As seguintes credenciais **já foram geradas** e estão no arquivo `.env.railway`:

```bash
# ✅ Já gerado - guardar em local seguro!
SETUP_PASSWORD=T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=
OPENCLAW_GATEWAY_TOKEN=472eb1f41e0ae34a224eed25068364cfef4d083d839add95a9927bc422f9b5d7
```

---

## 🔒 Segurança - Boas Práticas

### ✅ Fazer

- [ ] Guardar credenciais em **password manager** (1Password, Bitwarden, etc)
- [ ] **NÃO** fazer commit de `.env.railway` no git
- [ ] **NÃO** compartilhar TELEGRAM_BOT_TOKEN com ninguém
- [ ] **NÃO** compartilhar ANTHROPIC_API_KEY
- [ ] Usar **HTTPS** (Railway fornece automaticamente)
- [ ] Ativar **2FA** no Anthropic (quando possível)
- [ ] Rotacionar credenciais a cada 6 meses
- [ ] Usar domínio customizado (não Railway public domain)

### ❌ Não Fazer

- [ ] Colocar credenciais em arquivos versionados (git)
- [ ] Compartilhar credenciais em Slack/Discord/Email
- [ ] Usar senhas simples ou reutilizadas
- [ ] Deixar Railway em modo "unconfigured" (sem autenticação)
- [ ] Usar HTTP (sempre HTTPS)
- [ ] Logar credenciais (Railway scrubeia automático)

---

## 📋 Próximas Fases

Depois de criar essas contas, podemos:

**Fase 2**: Preparar repositório localmente (Node 22.12+ e dependências)
**Fase 3**: Validar Dockerfile e testar localmente
**Fase 4**: Deploy na Railway via GitHub
**Fase 5**: Configurar domínio customizado em Railway + HTTPS
**Fase 6**: Executar onboarding wizard (http://seu-dominio.com/setup)
**Fase 7**: Testar Telegram + validar sistema

---

## 🚀 Tempo Estimado

- Railway: 5 min
- Anthropic: 5 min
- Telegram: 3 min
- Domínio: 10 min (se comprar novo)
- **Total: ~20-30 minutos**

---

## ❓ Dúvidas Frequentes

**P: Posso usar Railway sem domínio customizado?**
R: Sim, mas Railway fornece domínio público (menos seguro, compartilhado). Domínio customizado é recomendado.

**P: A Anthropic API é gratuita?**
R: Tem $5 crédito inicial. Após usar, precisa adicionar cartão de crédito e pagar conforme uso (muito barato).

**P: E se perdi o TELEGRAM_BOT_TOKEN?**
R: Vá para @BotFather e use /mybots → selecione bot → Edit Bot → Token para gerar novo.

**P: Preciso de cartão de crédito para Railway?**
R: Free tier não precisa. Paidrá depois se exceder limites (improvável para uso pessoal).

**P: Quantas contas preciso criar?**
R: 4 mínimo (Railway, Anthropic, Telegram, e opcionalmente Domínio). Todas grátis ou muito baratas.

---

**Status**: Pronto para começar? ✅ Vá para a próxima fase quando tiver as 4 contas criadas!
