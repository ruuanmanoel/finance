const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post("/cadastro", async (req, res) => {
  const { name, birthDate, email, password, cpf, address } = req.body;
  const saltRounds = 10;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const userData = {
      name,
      birthDate: new Date(birthDate),
      email,
      password: hash,
      cpf: cpf || null,
      address: address || null,
    };

    const newUser = await prisma.user.create({ data: userData });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("está rodando localhost:" + process.env.PORT);
});
