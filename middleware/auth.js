const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization; //req.cookies.token - testando primeiro;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Não autenticado: token não encontrado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

module.exports = auth;
