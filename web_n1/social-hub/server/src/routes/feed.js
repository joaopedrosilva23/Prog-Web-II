import { Router } from "express";
import { prisma } from "../lib/db.js";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();

function verifyToken(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: "Nao autenticado" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalido" });
  }
}

const messageSchema = z.object({
  content: z
    .string()
    .min(1, "A mensagem nao pode estar vazia")
    .max(256, "Mensagem muito grande! (máximo de 256 caracteres)"),
});

// GET /api/feed
router.get("/", verifyToken, async (req, res) => {
  try {
    const messages = await prisma.post.findMany({
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (err) {
    console.error("Erro ao carregar mensagens:", err);
    res.status(500).json({ error: "Erro ao carregar mensagens" });
  }
});

// POST /api/feed
router.post("/", verifyToken, async (req, res) => {
  try {
    const { content } = messageSchema.parse(req.body);

    const message = await prisma.post.create({
      data: {
        content,
        authorId: req.userId,
      },
      include: { author: { select: { name: true, email: true } } },
    });

    res.status(201).json(message);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("Erro ao criar mensagem:", err);
    res.status(500).json({ error: "Erro ao criar mensagem" });
  }
});

// DELETE /api/feed/:id
router.delete("/:id", verifyToken, async (req, res) => {
  const messageId = Number(req.params.id);
  if (isNaN(messageId)) return res.status(400).json({ error: "Id invalido" });

  try {
    const message = await prisma.post.findUnique({ where: { id: messageId } });

    if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });
    if (message.authorId !== req.userId)
      return res.status(403).json({ error: "Não é possivel deletar essa mensagem" });

    await prisma.post.delete({ where: { id: messageId } });
    return res.status(200).json({ message: "Mensagem deletada" });
  } catch (err) {
    console.error("Erro ao deletar mensagem:", err);
    return res.status(500).json({ error: "Erro ao deletar mensagem" });
  }
});

export default router;
