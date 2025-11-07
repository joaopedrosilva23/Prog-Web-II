import { Router } from "express";
import { prisma } from "../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();

router.post("/check", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    res.json({ exists: !!user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// tratamento dos campos de usuario
const signupSchema = z.object({
  name: z.string().min(2, "Este nome é muito curto!"),
  email: z.string().email("Email inválido!"),
  password: z.string().min(8, "A senha deve conter pelo menos 8 caracteres!"),
  confirmPassword: z.string().min(8)
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem! ",
  path: ["confirmPassword"],
});

const loginSchema = z.object({  
  email: z.string().email(),
  password: z.string().min(1),
});

function setSessionCookie(res, userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("session", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

// logando...
router.post("/signup", async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return res.status(409).json({ error: "Email já cadastrado!" });

    const passwordHash = await bcrypt.hash(data.password, 11);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash },
      select: { id: true, name: true, email: true },
    });

    setSessionCookie(res, user.id);
    return res.status(201).json({ user });
  } catch (err) {
    if (err?.issues) return res.status(400).json({ error: "Dados inválidos", details: err.issues });
    console.error(err);
    return res.status(500).json({ error: "Falha no registro" });
  }
});

// tratamento de erros de login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Credenciais inválidas" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Dados inválidos" });

    setSessionCookie(res, user.id);
    return res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    if (err?.issues) return res.status(400).json({ error: "Dados inválidos" });
    console.error(err);
    return res.status(500).json({ error: "Falha na autenticação" });
  }
});

//   tratamento de erros de autenticaçao
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.session;
    if (!token) return res.status(401).json({ error: "Não autenticado" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true },
    });

    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    return res.json(user);
  } catch (err) {
    console.error("Error in /me:", err);
    return res.status(401).json({ error: "Token inválido" });
  }
});

// POST /api/session/logout
router.post("/logout", (req, res) => {
  res.clearCookie("session", { path: "/" });
  return res.json({ message: "Logged out" });
});

export default router;
