#!/bin/bash

# ============================================
# OpenClaw Railway Deployment Script
# Setup completo para deploy no Railway
# ============================================

set -e  # Exit on error

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SOURCE_DIR/.env.railway"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# Functions
# ============================================

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ============================================
# Validações Iniciais
# ============================================

validate_requirements() {
    log_info "Validando requisitos..."

    # Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js não encontrado. Instale Node >= 22.12.0"
        exit 1
    fi
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    log_success "Node.js: $NODE_VERSION"

    # Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker não encontrado. Instale Docker Desktop"
        exit 1
    fi
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | cut -d',' -f1)
    log_success "Docker: $DOCKER_VERSION"

    # Git
    if ! command -v git &> /dev/null; then
        log_error "Git não encontrado. Instale Git"
        exit 1
    fi
    log_success "Git: $(git --version | awk '{print $3}')"

    # Arquivo .env.railway
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Arquivo .env.railway não encontrado!"
        log_info "Execute este script no raiz do repositório"
        exit 1
    fi
    log_success ".env.railway encontrado"
}

# ============================================
# Build Docker
# ============================================

build_docker() {
    log_info "Building Docker image..."
    echo ""

    if docker build -t openclaw:latest -f Dockerfile .; then
        log_success "Docker image buildado com sucesso!"
        docker images | grep openclaw | head -5
    else
        log_error "Erro ao buildar Docker image"
        exit 1
    fi
}

# ============================================
# Testar Docker Localmente (Opcional)
# ============================================

test_docker_local() {
    read -p "Deseja testar a imagem Docker localmente? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        log_info "Iniciando container de teste..."
        
        # Exports from .env.railway
        export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
        
        docker run --rm -it \
            -p 8080:18789 \
            -e SETUP_PASSWORD="$SETUP_PASSWORD" \
            -e OPENCLAW_GATEWAY_TOKEN="$OPENCLAW_GATEWAY_TOKEN" \
            -e NODE_ENV=production \
            -e PORT=8080 \
            openclaw:latest
    fi
}

# ============================================
# Instrções para Railway
# ============================================

instructions_railway() {
    cat << 'EOF'

════════════════════════════════════════════════════════════
    🚀 PRÓXIMOS PASSOS - DEPLOY NO RAILWAY
════════════════════════════════════════════════════════════

✅ Docker image criado e pronto!

📋 PASSO 1: FAZER PUSH PARA GITHUB
────────────────────────────────────

Se ainda não tem repositório:
  $ git remote add origin https://github.com/seu-usuario/openclaw.git
  $ git branch -M main
  $ git push -u origin main

Se já tem:
  $ git add .
  $ git commit -m "OpenClaw Railway setup"
  $ git push


📋 PASSO 2: CONECTAR RAILWAY AO GITHUB
────────────────────────────────────────

1. Ir para https://railway.app
2. Fazer login (com GitHub recomendado)
3. Dashboard → New Project
4. Selecionar "Deploy from GitHub"
5. Autorizar Railway com seu GitHub
6. Selecionar repositório "openclaw"
7. Clicar "Deploy"


📋 PASSO 3: CONFIGURAR VARIÁVEIS DE AMBIENTE
─────────────────────────────────────────────

No Railway Dashboard:
1. [seu projeto] → Settings → Variables
2. Adicionar cada variável:

   SETUP_PASSWORD=T6/yVNt6z96rOHM55MFchF5nfyCPgRFNyflMPTjQnjg=
   OPENCLAW_GATEWAY_TOKEN=472eb1f41e0ae34a224eed25068364cfef4d083d839add95a9927bc422f9b5d7
   ANTHROPIC_API_KEY=sk-ant-<sua-chave-aqui>
   TELEGRAM_BOT_TOKEN=<seu-token-telegram>
   NODE_ENV=production
   PORT=8080
   OPENCLAW_STATE_DIR=/data
   OPENCLAW_WORKSPACE_DIR=/data/workspace

⚠️  NUNCA coloque essas credenciais em git!


📋 PASSO 4: CRIAR VOLUME DE PERSISTÊNCIA
──────────────────────────────────────────

No Railway Dashboard:
1. [seu projeto] → Storage
2. "Add Volume"
3. Mount Path: /data
4. Size: 1GB (mínimo)


📋 PASSO 5: AGUARDAR DEPLOY
─────────────────────────────

Railway fará:
1. Detectar Dockerfile
2. Build da imagem (⏱️ ~15 min)
3. Deploy em container
4. Fornecer público URL

Status em: https://railway.app → seu projeto


📋 PASSO 6: CONFIGURAR DOMÍNIO CUSTOMIZADO
────────────────────────────────────────────

Se tem domínio (ex: meuopenclaw.com):

No Railway Dashboard:
1. [seu projeto] → Settings → Domains
2. "Custom Domain"
3. Adicionar seu domínio

No seu registrador de domínio (Namecheap, etc):
1. DNS Management
2. Adicionar CNAME:
   Name: @ (ou seu subdomain)
   Value: <railway-domain-fornecido>
3. Aguardar propagação (~15-30 min)

HTTPS é automático via Let's Encrypt!


📋 PASSO 7: ACESSAR ONBOARDING WIZARD
──────────────────────────────────────

Após deploy bem-sucedido:

1. Abrir: https://seu-dominio.com/setup
2. Entrar com SETUP_PASSWORD
3. Configurar:
   - Model Provider: Anthropic
   - API Key: ANTHROPIC_API_KEY
   - Model: Claude 3.5 Sonnet
4. Ativar extensions (Email, Browser, Search, Memory)
5. Adicionar canal Telegram
6. Salvar e finalizar


📋 PASSO 8: TESTAR
───────────────────

1. Abrir: https://seu-dominio.com/openclaw
2. Enviar mensagem no Telegram ao seu bot
3. Verificar logs no Railway: railway logs --project <id>


════════════════════════════════════════════════════════════

🔒 SEGURANÇA - NUNCA FAÇA:
  ❌ Colocar credenciais em git
  ❌ Compartilhar API keys em Slack/Email
  ❌ Usar senhas fracas
  ❌ Deixar gateway sem autenticação

✅ SEMPRE:
  ✅ Use HTTPS (Railway fornece)
  ✅ Guarde credenciais em password manager
  ✅ Rotacione credenciais a cada 6 meses
  ✅ Habilite 2FA quando possível

════════════════════════════════════════════════════════════

📚 Recursos úteis:
  • Railway Docs: https://docs.railway.app
  • OpenClaw Docs: https://docs.openclaw.ai
  • GitHub: https://github.com/openclaw/openclaw
  • Discord: https://discord.gg/qkhbAGHRBT

════════════════════════════════════════════════════════════

EOF
}

# ============================================
# Main Menu
# ============================================

main() {
    clear
    
    echo -e "${BLUE}"
    cat << 'EOF'
╔════════════════════════════════════════════════════════════╗
║  🦞 OpenClaw Railway Deployment Script                     ║
║     Setup completo para produção na nuvem                  ║
╚════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    validate_requirements
    echo ""

    echo "Opções disponíveis:"
    echo "1) Build Docker image (obrigatório)"
    echo "2) Testar Docker localmente (opcional)"
    echo "3) Ver instruções para Railway (próximos passos)"
    echo "4) Fazer tudo acima"
    echo ""

    read -p "Escolha uma opção (1-4): " choice

    case $choice in
        1)
            build_docker
            ;;
        2)
            test_docker_local
            ;;
        3)
            instructions_railway
            ;;
        4)
            build_docker
            test_docker_local
            instructions_railway
            ;;
        *)
            log_error "Opção inválida"
            exit 1
            ;;
    esac

    echo ""
    log_success "Concluído!"
}

# ============================================
# Execute
# ============================================

main "$@"
