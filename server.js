const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware");

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (user === null) {
      return res.status(201).json({ message: "Email não encontrado." });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 3600000,
        })
        .json({ message: "Logado com sucesso", token });
    } else {
      return res.status(201).json({ message: "Senha invalida" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error ao buscar usuário." });
  }
});

app.listen(process.env.PORT, () => {
  console.log("está rodando localhost:" + process.env.PORT);
});
