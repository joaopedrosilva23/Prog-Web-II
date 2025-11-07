# Social Hub

A modern social media application built with React and Node.js. Share messages, reply to posts, and connect with others!

## 🚀 Features

- **User Authentication**: Sign up and login with email/password
- **Messages**: Create, view, and delete messages
- **Replies**: Comment on messages with pagination
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- Zod Validation

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3 with animations

## 📋 Prerequisites

- Node.js v18+
- PostgreSQL v12+
- npm or pnpm

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd social-hub
```

### 2. Setup Backend

```bash
cd server
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

Install dependencies:
```bash
npm install
```

Setup database:
```bash
npx prisma migrate dev --name init
```

Start server:
```bash
npm run dev
```

Server will run on `http://localhost:3000`

### 3. Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/session/signup` - Create new account
- `POST /api/session/login` - Login
- `GET /api/session/me` - Get current user
- `POST /api/session/logout` - Logout
- `POST /api/session/check` - Check if email exists

### Messages (Feed)
- `GET /api/feed` - Get all messages
- `POST /api/feed` - Create message
- `DELETE /api/feed/:id` - Delete message

### Replies (Comments)
- `GET /api/reply/:messageId` - Get replies for a message
- `POST /api/reply` - Create reply
- `DELETE /api/reply/:id` - Delete reply

## 🎨 Design Features

- **Gradient backgrounds**: Purple to blue gradients
- **Smooth animations**: Fade-in and slide-down effects
- **Interactive cards**: Hover effects and transitions
- **Character counter**: Real-time message length feedback
- **Modal dialogs**: For viewing full messages and replies
- **Confirmation dialogs**: Before deleting content

## 📝 Project Structure

```
social-hub/
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── session.js    (Authentication)
│   │   │   ├── feed.js       (Messages)
│   │   │   └── reply.js      (Comments)
│   │   ├── middleware/
│   │   │   └── verify.js     (JWT verification)
│   │   ├── lib/
│   │   │   └── db.js         (Prisma client)
│   │   └── index.js          (Server entry)
│   ├── prisma/
│   │   └── schema.prisma     (Database schema)
│   └── package.json
│
└── client/
    ├── src/
    │   ├── pages/
    │   │   ├── AuthPage.jsx   (Login/Signup)
    │   │   └── FeedPage.jsx   (Main feed)
    │   ├── components/
    │   │   ├── MessageCard.jsx
    │   │   └── MessageModal.jsx
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── auth.css
    │   │   └── feed.css
    │   ├── api.js             (API client)
    │   ├── App.jsx            (Main component)
    │   └── main.jsx           (Entry point)
    └── package.json
```

## 🔐 Security

- Passwords hashed with bcrypt (cost factor 11)
- JWT tokens stored in HTTP-only cookies
- CORS enabled for localhost
- Rate limiting on authentication endpoints
- Input validation with Zod

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Tablet (768px to 1024px)
- Mobile (320px to 767px)

## 🚀 Deployment

To build for production:

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

## 📄 License

MIT License - feel free to use this project for any purpose.

## 👨‍💻 Author

Created as a modern social media platform example.

---

**Last Updated**: November 2025
