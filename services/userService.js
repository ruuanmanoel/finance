// services/userService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function copyDefaultCategoriesForUser(userId) {
  const defaultCategories = await prisma.category.findMany({
    where: { userId: null },
  });

  if (defaultCategories.length === 0) {
    throw new Error("Nenhuma categoria padrão encontrada.");
  }

  const categoriesToCreate = defaultCategories.map((category) => ({
    name: category.name,
    type: category.type,
    userId: userId,
  }));

  await prisma.category.createMany({ data: categoriesToCreate });
}

module.exports = { copyDefaultCategoriesForUser };
