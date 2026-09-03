# 🏢 Olividros Vidraçaria - Sistema Completo de Gestão, Orçamentos & Assinatura Digital

Sistema moderno, responsivo (mobile-first e desktop) e profissional desenvolvido para a **Olividros Vidraçaria** (Rua XV de Novembro, 319 - Austin / Nova Iguaçu - RJ).

---

## 🚀 Funcionalidades Principais

### 1. 📊 Gestão Financeira & Fluxo de Caixa
- Controle de receitas por serviços de vidros e instalações.
- Gestão de despesas com fornecedores categorizadas:
  - Vidros Temperados (Chapas Cebrace, Glássico, etc.)
  - Perfis & Kits de Alumínio (Alclean, Ideia Glass)
  - Ferragens & Puxadores Inox
  - Silicone PU & Vedação Estrutural
  - Combustível da Van/Fiorino & Salários
- Indicadores de faturamento, saídas e lucro líquido com cálculo de margem em tempo real.

### 2. 🔗 Link Público de Orçamento para Clientes (`/solicitar`)
- O Administrador pode copiar o link e enviar a qualquer cliente pelo WhatsApp ou divulgar no Instagram `@olividros.vidracaria`.
- Seletor visual de serviços: Box para Banheiro, Janelas 2F/4F, Portas Pivotantes/Correr, Espelhos Bisotados e Lapidados, Guarda-Corpo, Cortina de Vidros, Tampos de Mesa e Manutenções.
- Seleção de espessura e cores do vidro (Incolor, Fumê, Verde, Bronze, Jateado) e do alumínio (Preto, Branco, Fosco, Bronze, Inox, Dourado).
- Calculadora de medidas e m².
- Geração de protocolo único (ex: `#OLI-2024-812`) e notificação direta no painel administrativo.

### 3. ✍️ Proposta Comercial com Assinatura Digital do Cliente
- O Administrador envia o orçamento pelo WhatsApp com 1 clique.
- O cliente abre no próprio smartphone, confere as especificações técnicas, valores e prazos.
- **Aceite com Assinatura Digital**: o cliente desenha a assinatura com o dedo na tela, informa nome/CPF e aprova a proposta.
- O status atualiza automaticamente no painel administrativo para **"Aprovado / Em Produção"** com carimbo da assinatura e data/hora.

### 4. 🚚 Módulo de Campo para Funcionários & Instaladores
- Interface otimizada para celular do instalador na van/rua.
- Rotas rápidas com botão **"Abrir no Google Maps / Waze"** para o endereço do cliente em Austin, Nova Iguaçu e Baixada Fluminense.
- Checklist de conferência de qualidade (vidro sem riscos, roldanas reguladas, silicone aplicado).
- **Protocolo de Assinatura Digital Dupla**:
  1. O Instalador assina atestando a conclusão técnica do serviço.
  2. O Cliente assina no celular do instalador atestando que recebeu o vidro instalado e testado em perfeito estado.
- Status atualiza imediatamente para **"Concluído"** no painel da vidraçaria.

### 5. 📄 Emissão de Nota Simples & Recibo de Garantia
- Documento timbrado oficial com dados da Vidraçaria Olividros, CNPJ e contato.
- Discriminação completa de vidros, ferragens, medidas (m²) e valores.
- Termo de garantia oficial (1 ano ferragens e vedação / 5 anos têmpera conforme norma ABNT NBR 14698/14207).
- Estampa visual das assinaturas digitais registradas (aceite e entrega).
- Botão para **Imprimir / Salvar em PDF (formato A4)** e botão para **Compartilhar no WhatsApp do Cliente**.

---

## 🗄️ Banco de Dados Simples e Grátis (Recomendação)

### 🥇 1. Supabase (PostgreSQL na Nuvem) - **Recomendado**
- **Plano Gratuito:** 500 MB de banco relacional PostgreSQL, 1 GB de Storage para fotos de vidros/instalações e 50.000 usuários ativos.
- **Vantagem Principal (Realtime):** Quando o cliente assina pelo WhatsApp ou o instalador assina na rua, o painel do ADM atualiza na hora sem precisar recarregar a página!
- **Como configurar:**
  1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
  2. No painel do projeto, abra o **SQL Editor** e cole o script disponível no botão **"Banco de Dados"** do sistema.
  3. Pronto! Seu banco está ativo e sincronizado.

### 🥈 2. LocalStorage Híbrido (Já Ativo e Funcionando)
- O sistema já funciona 100% no navegador sem precisar criar contas de imediato.
- Possui ferramenta integrada de **Backup em JSON** para download e restauração de dados com 1 clique.

---

## 🚀 Como Fazer Deploy

### Passo 1: Enviar para o GitHub

Execute os comandos no terminal:

```bash
git init
git add .
git commit -m "feat: Sistema completo Olividros Vidraçaria com assinaturas digitais e financeiro"
git branch -M main
git remote add origin https://github.com/santwoxx/olividros-sistema.git
git push -u origin main
```

*(Se o repositório já contiver commits no GitHub, utilize `git push -u origin main --force`)*

### Passo 2: Publicar na Vercel (1 Clique Grátis)

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New"** -> **"Project"**.
3. Selecione o repositório **`santwoxx/olividros-sistema`**.
4. A Vercel detectará automaticamente o **Vite** e configurará:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Clique em **"Deploy"**.
6. Em menos de 1 minuto seu sistema estará no ar com HTTPS gratuito!

---

## 🛠️ Tecnologias Utilizadas
- **React 18** com **TypeScript**
- **Vite 6** (Build ultrarrápido)
- **Vanilla CSS** com Design System Temático (Vidro Fumê Escuro, Efeitos Neon Cyan & Glassmorphism)
- **Lucide Icons**
- **HTML5 Canvas** para Assinaturas Digitais em Telas Touch/Mobile
- **Canvas Confetti** para celebração de aprovação de orçamentos
