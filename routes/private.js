const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { getNameCategory } = require("../services/categoryService");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/categorias", async (req, res) => {
  const { id } = req.user;
  try {
    const categories = await prisma.category.findMany({
      where: { userId: id },
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

router.post("/transacao", async (req, res) => {
  const { id } = req.user;
  const {
    bankAccountId,
    categoryId,
    type,
    amount,
    description,
    paymentMethod,
    transactionDate,
  } = req.body;
  try {
    const categoryName = await getNameCategory(categoryId, id);
    transactionData = {
      userId: id,
      bankAccountId: bankAccountId || null,
      categoryId: categoryId,
      type: type,
      amount: amount,
      description: description || null,
      paymentMethod: paymentMethod || null,
      transactionDate: new Date(transactionDate),
      categoryName: categoryName,
    };

    newtransction = await prisma.$transaction(async (tx) => {
      const transaction = tx.transaction.create({ data: transactionData });
      if (bankAccountId) {
        const adjustment = type === "income" ? amount : -amount;
        await tx.bankAccount.update({
          where: { id: bankAccountId },
          data: {
            currentBalance: {
              increment: adjustment,
            },
          },
        });
      }
      return transaction;
    });
    return res.status(201).json(newtransction);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Não foi possivel cadastrar transação." });
  }
});

router.post("/contas", async (req, res) => {
  const { id } = req.user;
  const { name, agency, account, initialBalance } = req.body;

  try {
    const accountData = {
      userId: id,
      name,
      agency: agency || null,
      account: account || null,
      initialBalance,
      currentBalance: initialBalance,
    };
    const newAccount = await prisma.bankAccount.create({ data: accountData });
    return res.status(201).json(newAccount);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Não foi posivel cadastrar uma conta" });
  }
});

module.exports = router;
