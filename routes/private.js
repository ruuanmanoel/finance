const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/categorias", async (req, res) => {
  const { id } = req.user;
  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          {
            userId: null,
          },
          { userId: id },
        ],
      },
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

module.exports = router;
