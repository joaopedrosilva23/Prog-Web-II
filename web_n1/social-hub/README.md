# Social Hub

Um aplicativo moderno de rede social desenvolvido com React e Node.js. Compartilhe mensagens, responda a postagens e conecte-se com outras pessoas!

## 🚀 Funcionalidades

* **Autenticação de Usuário**: Cadastro e login com e-mail/senha
* **Mensagens**: Criar, visualizar e excluir mensagens
* **Respostas**: Comentar mensagens com paginação
* **Interface Moderna**: Design com gradientes e animações suaves
* **Responsivo**: Funciona em computadores e dispositivos móveis

## 🛠️ Tecnologias Utilizadas

### Backend

* Node.js + Express.js
* PostgreSQL + Prisma ORM
* Autenticação com JWT
* Validação com Zod

### Frontend

* React 18
* React Router DOM
* Axios
* CSS3 com animações

## 📋 Pré-requisitos

* Node.js v18+
* PostgreSQL v12+
* npm ou pnpm

## 🔧 Instalação

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd social-hub
```

### 2. Configurar o Backend

```bash
cd server
cp .env.example .env
# Edite o arquivo .env com suas credenciais do PostgreSQL
```

Instalar dependências:

```bash
npm install
```

Configurar o banco de dados:

```bash
npx prisma migrate dev --name init
```

Iniciar o servidor:

```bash
npm run dev
```

O servidor será executado em `http://localhost:3000`

### 3. Configurar o Frontend

```bash
cd ../client
npm install
npm run dev
```

O frontend será executado em `http://localhost:5173`

## 📚 Endpoints da API

### Autenticação

* `POST /api/session/signup` - Criar nova conta
* `POST /api/session/login` - Fazer login
* `GET /api/session/me` - Obter usuário atual
* `POST /api/session/logout` - Fazer logout
* `POST /api/session/check` - Verificar se o e-mail existe

### Mensagens (Feed)

* `GET /api/feed` - Obter todas as mensagens
* `POST /api/feed` - Criar mensagem
* `DELETE /api/feed/:id` - Excluir mensagem

### Respostas (Comentários)

* `GET /api/reply/:messageId` - Obter respostas de uma mensagem
* `POST /api/reply` - Criar resposta
* `DELETE /api/reply/:id` - Excluir resposta

## 🎨 Recursos de Design

* **Fundos em gradiente**: tons de roxo para azul
* **Animações suaves**: efeitos de fade-in e slide-down
* **Cartões interativos**: efeitos de hover e transições
* **Contador de caracteres**: feedback em tempo real
* **Modais**: para visualizar mensagens e respostas completas
* **Diálogos de confirmação**: antes de excluir conteúdo

## 📝 Estrutura do Projeto

```
social-hub/
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── session.js    (Autenticação)
│   │   │   ├── feed.js       (Mensagens)
│   │   │   └── reply.js      (Comentários)
│   │   ├── middleware/
│   │   │   └── verify.js     (Verificação JWT)
│   │   ├── lib/
│   │   │   └── db.js         (Cliente Prisma)
│   │   └── index.js          (Entrada do servidor)
│   ├── prisma/
│   │   └── schema.prisma     (Esquema do banco de dados)
│   └── package.json
│
└── client/
    ├── src/
    │   ├── pages/
    │   │   ├── AuthPage.jsx   (Login/Cadastro)
    │   │   └── FeedPage.jsx   (Feed principal)
    │   ├── components/
    │   │   ├── MessageCard.jsx
    │   │   └── MessageModal.jsx
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── auth.css
    │   │   └── feed.css
    │   ├── api.js             (Cliente da API)
    │   ├── App.jsx            (Componente principal)
    │   └── main.jsx           (Ponto de entrada)
    └── package.json
```

## 🔐 Segurança

* Senhas criptografadas com bcrypt (fator de custo 11)
* Tokens JWT armazenados em cookies HTTP-only
* CORS habilitado para localhost
* Limite de requisições nos endpoints de autenticação
* Validação de entradas com Zod

## 📱 Design Responsivo

O aplicativo é totalmente responsivo e funciona em:

* Desktop (1920px ou mais)
* Tablet (768px a 1024px)
* Mobile (320px a 767px)

## 🚀 Implantação

Para construir para produção:

**Backend:**

```bash
cd server
npm run build
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm run preview
```

## 📄 Licença

Licença MIT — sinta-se livre para usar este projeto para qualquer finalidade.

## 👨‍💻 Autor

Criado como exemplo de uma plataforma moderna de rede social.

---

**Última atualização**: Novembro de 2025
