import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: "Não autenticado" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
