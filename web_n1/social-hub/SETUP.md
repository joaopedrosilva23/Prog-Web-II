# Setup Local - Social Hub

## Pré-requisitos

- Node.js v18+
- PostgreSQL v12+
- npm ou pnpm

## 1. Configurar Banco de Dados

```bash
# Criar banco de dados PostgreSQL
createdb social_hub

# Ou via psql:
psql -U postgres
CREATE DATABASE social_hub;
\q
```

## 2. Configurar Backend

```bash
cd server

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas credenciais PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/social_hub"
# JWT_SECRET="sua-chave-secreta-super-segura"
```

Instalar dependências:
```bash
npm install
```

Executar migrações:
```bash
npx prisma migrate dev --name init
```

Iniciar servidor:
```bash
npm run dev
```

Servidor rodará em `http://localhost:3000`

## 3. Configurar Frontend

```bash
cd ../client

# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev
```

Frontend rodará em `http://localhost:5173`

## 4. Usar a Aplicação

1. Abra `http://localhost:5173` no navegador
2. Clique em "Sign Up" para criar uma conta
3. Faça login com suas credenciais
4. Comece a postar mensagens!

## 🔧 Troubleshooting

### Erro de conexão com PostgreSQL
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres -c "SELECT 1"

# Verificar DATABASE_URL no arquivo .env
```

### Erro nas migrações
```bash
# Resetar banco de dados (cuidado!)
npx prisma migrate reset

# Ou recriar manualmente:
dropdb social_hub
createdb social_hub
npx prisma migrate dev --name init
```

### Porta 3000 ou 5173 já em uso
```bash
# Mudar porta do servidor
PORT=3001 npm run dev

# Mudar porta do frontend no vite.config.js
```

### Erro de CORS
Certifique-se de que:
- Frontend está em `http://localhost:5173`
- Backend está em `http://localhost:3000`
- CORS está configurado em `server/src/index.js`

## 📚 Variáveis de Ambiente

### Server (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/social_hub"
JWT_SECRET="sua-chave-super-secreta-aqui"
PORT=3000
NODE_ENV=development
```

## 🚀 Build para Produção

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

---

**Pronto para começar!** 🎉
