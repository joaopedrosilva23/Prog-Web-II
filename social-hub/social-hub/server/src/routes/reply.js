import { Router } from "express";
import { prisma } from "../lib/db.js";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();

function verifyToken(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: "Não autenticado" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalido" });
  }
}

const replySchema = z.object({
  messageId: z.number(),
  content: z
    .string()
    .min(1, "O comentario nao pode estar vazio")
    .max(256, "Comentário muito gande!"),
});

// GET /api/reply/:messageId
router.get("/:messageId", async (req, res) => {
  const messageId = parseInt(req.params.messageId);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [replies, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId: messageId },
        include: { author: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where: { postId: messageId } }),
    ]);

    const totalPages = Math.ceil(total / limit);
    res.json({ replies, totalPages });
  } catch (err) {
    console.error("Erro ao listar as mensagens", err);
    res.status(500).json({ error: "Erro ao listar os comentários" });
  }
});

// POST /api/reply
router.post("/", verifyToken, async (req, res) => {
  try {
    const data = replySchema.parse({
      messageId: Number(req.body.messageId),
      content: req.body.content,
    });

    const reply = await prisma.comment.create({
      data: {
        content: data.content,
        postId: data.messageId,
        authorId: req.userId,
      },
      include: { author: { select: { name: true, email: true } } },
    });

    res.status(201).json(reply);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors[0].message });

    console.error("Erro ao criar comentário:", err);
    res.status(500).json({ error: "Erro ao criar comentário" });
  }
});

// DELETE /api/reply/:id
router.delete("/:id", verifyToken, async (req, res) => {
  const replyId = Number(req.params.id);
  if (isNaN(replyId))
    return res.status(400).json({ error: "Id invalido" });

  try {
    const reply = await prisma.comment.findUnique({
      where: { id: replyId },
    });

    if (!reply)
      return res.status(404).json({ error: "Resposta nao encontrada" });

    if (reply.authorId !== req.userId)
      return res
        .status(403)
        .json({ error: "Não é possivel deletar esse comentario" });

    await prisma.comment.delete({ where: { id: replyId } });

    return res.status(200).json({ message: "Resposta deletada" });
  } catch (err) {
    console.error("Erro ao deletar resposta:", err);
    res.status(500).json({ error: err.message || "Erro ao deletar resposta" });
  }
});

export default router;
