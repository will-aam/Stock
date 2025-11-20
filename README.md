# Val - Sistema de Gestão de Lotes e Validades

Sistema de gerenciamento de lotes e datas de validade para lojas de varejo, focado em FIFO (First-In, First-Out) e prevenção de perdas.

## 🎯 Funcionalidades Principais

- **Dashboard**: Visão geral com KPIs críticos, alertas e atividades recentes
- **Scanner de Entrada**: Interface otimizada para registro rápido de lotes via código de barras
- **Inventário**: Listagem e filtragem de produtos com status de validade
- **Modo Auditoria**: Interface task-based para conferência de prateleiras
- **Sistema de Alertas**: Classificação automática (Crítico, Alerta, Seguro)
- **Suporte PWA**: Otimizado para uso em dispositivos móveis

## 🏗️ Arquitetura

### Estrutura de Páginas

\`\`\`
app/
├── (auth)/
│   └── login/          # Página de autenticação
├── (app)/
│   ├── dashboard/      # Painel principal
│   ├── entrada/        # Scanner de código de barras
│   ├── inventario/     # Lista de produtos e lotes
│   └── auditoria/      # Interface de auditoria
\`\`\`

### Componentes Principais

- `dashboard/` - Componentes do painel (KPIs, atividades, ações rápidas)
- `entrada/` - Interface de scanner e formulário de lote
- `inventario/` - Lista de produtos com filtros
- `auditoria/` - Interface task-based de auditoria
- `layout/` - Navegação mobile e estrutura
- `auth/` - Formulário de login

## 🗄️ Banco de Dados

O esquema Prisma está definido em `prisma/schema.prisma` com os seguintes modelos:

- **User**: Usuários do sistema (admin, gerente, repositor)
- **Store**: Lojas (suporte multi-loja)
- **Product**: Cadastro de produtos com EAN
- **Batch**: Lotes individuais com data de validade
- **AuditLog**: Histórico de todas as ações

### Status de Lotes

- `SAFE`: Vence em > 45 dias
- `WARNING`: Vence em 15-45 dias
- `CRITICAL`: Vence em < 15 dias
- `EXPIRED`: Já vencido
- `DEPLETED`: Estoque zerado

## 🚀 Próximos Passos

### 1. Configurar Banco de Dados

\`\`\`bash
# Instalar dependências
npm install @prisma/client

# Configurar variável de ambiente
# DATABASE_URL="postgresql://user:password@localhost:5432/val"

# Executar migrations
npx prisma migrate dev --name init

# Gerar Prisma Client
npx prisma generate
\`\`\`

### 2. Implementar Autenticação

- Integrar sistema de autenticação (NextAuth.js, Supabase, etc.)
- Adicionar middleware de proteção de rotas
- Implementar sistema de sessões

### 3. Conectar API ao Banco de Dados

Criar Server Actions ou API Routes para:

- Login/Logout de usuários
- CRUD de produtos
- Registro de lotes
- Consulta de inventário
- Logs de auditoria

### 4. Lógica de Negócio

- Cálculo automático de status de lotes (cron job)
- Atualização de quantidades após auditoria
- Geração de relatórios
- Notificações para itens críticos

### 5. Melhorias Futuras

- Scanner de código de barras real (câmera do dispositivo)
- Relatórios de perda e performance
- Integração com sistema de PDV
- Sugestões de pedidos baseadas em histórico
- App móvel nativo (React Native)

## 📱 Design Mobile-First

O sistema foi projetado com foco em dispositivos móveis:

- Navegação inferior fixa
- Botões otimizados para toque (min 48px)
- Inputs com tamanho adequado (16px para evitar zoom)
- Suporte a PWA com safe areas
- Animações de feedback visual

## 🎨 Temas

Suporte completo para Dark Mode e Light Mode com variáveis CSS customizáveis no arquivo `globals.css`.

## 🔧 Tecnologias

- **Next.js 16** - Framework React
- **Prisma** - ORM para banco de dados
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

---

Desenvolvido com foco em performance e experiência do usuário em ambientes de varejo.
