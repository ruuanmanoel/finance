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

router.post("/categorias", async (req, res) => {
  const { id } = req.user;
  const { name, type } = req.body;
  try {
    const categoryData = {
      userId: id,
      name,
      type,
    };
    const categoryUser = await prisma.category.create({ data: categoryData });
    return res.status(201).json(categoryUser);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Não foi possivel cadastrar a categoria" });
  }
});

router.delete("/categorias", async (req, res) => {
  const { id } = req.user;
  const categoryId = req.body.id;
  try {
    const deletedCategory = await prisma.category.deleteMany({
      where: {
        AND: [
          {
            userId: id,
          },
          {
            id: categoryId,
          },
        ],
      },
    });
    if (deletedCategory == 0) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }
    return res.status(200).json("Categoria deletada com sucesso.");
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Não foi possivel deletar a categoria." });
  }
});

module.exports = router;
