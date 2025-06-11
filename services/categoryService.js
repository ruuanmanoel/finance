// services/categoryService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getNameCategory(categoryId, userId) {
  try {
    const categoria = await prisma.category.findMany({
      where: { AND: [{ id: categoryId }, { userId: userId }] },
    });
    return categoria[0]["name"];
  } catch (error) {
    return null;
  }
}

module.exports = { getNameCategory };
