# OpenClaw no Railway - Guia de Acesso

## 🔗 URL de Acesso
```
https://openclaw.upvya.com
```

## 🔑 Credenciais de Autenticação

### Gateway Token
Para usar a interface, você pode precisar colar o token manualmente no Dashboard:
```
472eb1f41e0ae34a224eed25068364cfef4d083d839add95a9927bc422f9b5d7
```

### Setup Password (para onboarding)
Se precisar fazer setup inicial:
```
T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=
```

## 🛠️ Informações Técnicas

- **Domínio**: openclaw.upvya.com
- **URL Segura (HTTPS)**: ✅ Certificado SSL válido via Railway
- **Gateway Port**: 18789 (WebSocket, interno)
- **Health Check Port**: 8080 (HTTP, para Railway probe)
- **Entrypoint**: `bash entrypoint.sh` (roda OpenClaw + HTTP wrapper)
- **Docker Image Base**: node:22-bookworm
- **Browser Automation**: ✅ Chromium + Xvfb inclusos

## 📋 Processo de Setup Recomendado

1. Acesse: https://openclaw.upvya.com
2. Se solicitar token, copie do valor acima
3. Complete o onboarding wizard
4. Configure suas integrações (Telegram, Discord, etc)

## 🔒 Segurança

- ✅ HTTPS com certificado SSL válido
- ✅ Gateway token autenticação
- ✅ Environment variables não commitadas em `.env.railway` (local apenas)
- ✅ Setup password para onboarding
- ⚠️ Aviso: Configure `gateway.trustedProxies` para Railway se houver problemas com detecção de IP do cliente

## 📝 Últimas Atualizações

- **Commit**: 503e6d8fb - Add HTTPS security headers and SSL documentation
- **Status**: ✅ RUNNING (com token configurado)
- **Build Logs**: https://railway.com/project/168776bf-55e0-4adb-9949-4498fcc93eb0

## 🆘 Troubleshooting

### "gateway token missing" no navegador
1. Recarregue a página (F5 ou Cmd+R)
2. Limpe cache do navegador (Cmd+Shift+Del)
3. Abra em modo incógnito
4. Se persistir, copie e cole o token manualmente no Dashboard

### "Not secure" na URL
- Verifique que está acessando via **HTTPS** (não HTTP!)
- URL correcta: `https://openclaw.upvya.com` 
- Railway fornece SSL automático

### Proxy headers warning nos logs
- Configuração opcional para melhor detecção de IP
- Não impede funcionamento básico
- Pode ser resolvido adicionando `gateway.trustedProxies` no `railway.toml`

## 📚 Links Úteis

- [Railway Project](https://railway.com/project/168776bf-55e0-4adb-9949-4498fcc93eb0)
- [GitHub Repository](https://github.com/neivam-carvalho/openclaw)
- OpenClaw Docs: https://docs.openclaw.ai/
