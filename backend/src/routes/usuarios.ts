
import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Cadastro de usuário
router.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha || senha.length < 8) {
    return res.status(400).json({
      erro: "Nome, e-mail e senha (mín. 8 caracteres) são obrigatórios."
    });
  }

  const jaExiste = await prisma.usuario.findUnique({
    where: { email }
  });

  if (jaExiste) {
    return res.status(409).json({
      erro: "E-mail já cadastrado."
    });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: { nome, email, senhaHash },
    select: {
      id: true,
      nome: true,
      email: true,
      createdAt: true
    }
  });

  return res.status(201).json(usuario);
});

// Autenticação dos usuários
router.post("/usuarios/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      erro: "E-mail e senha são obrigatórios."
    });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!usuario) {
    return res.status(401).json({
      erro: "E-mail ou senha inválidos."
    });
  }

  const senhaCorreta = await bcrypt.compare(
    senha,
    usuario.senhaHash
  );

  if (!senhaCorreta) {
    return res.status(401).json({
      erro: "E-mail ou senha inválidos."
    });
  }

  return res.status(200).json({
    mensagem: "Usuário autenticado com sucesso.",
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      createdAt: usuario.createdAt
    }
  });
});

export default router;
