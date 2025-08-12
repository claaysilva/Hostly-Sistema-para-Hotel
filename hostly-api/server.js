// ===================================================
// ARQUIVO: server.js (Versão Final e Consolidada)
// ===================================================

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // Importando o 'fs' no topo

// --- 1. CONFIGURAÇÃO INICIAL ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
const saltRounds = 10;

// --- 2. MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// --- 3. CONFIGURAÇÃO DO UPLOAD (MULTER) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usando o __dirname definido corretamente
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// --- 4. CONFIGURAÇÃO DO BANCO DE DADOS ---
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// ===================================
// 5. ROTAS DA API
// ===================================

app.get("/", (req, res) => res.send("API do Hostly está funcionando!"));

// --- ROTAS DE AUTENTICAÇÃO ---
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    await connection.end();
    if (users.length === 0)
      return res.status(401).json({ error: "Credenciais inválidas." });
    const user = users[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ error: "Credenciais inválidas." });
    const { password: _, ...userPayload } = user;
    res.status(200).json(userPayload);
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// Rota para LISTAR todos os usuários (GET)
app.get("/api/users", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Seleciona apenas os campos seguros, sem a senha
    const [rows] = await connection.execute(
      "SELECT id, name, email, role FROM users ORDER BY name"
    );
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro no servidor ao buscar usuários." });
  }
});

// --- ROTAS DE CLIENTES (CUSTOMERS) ---
// Cadastro de cliente com usuário vinculado (usado pelo admin)
app.post("/api/customers/with-user", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nome, e-mail e senha são obrigatórios." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const connection = await mysql.createConnection(dbConfig);
    // Cria usuário
    const [userResult] = await connection.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email.toLowerCase(), hashedPassword, "user"]
    );
    const userId = userResult.insertId;
    // Cria cliente vinculado ao usuário
    const [customerResult] = await connection.execute(
      "INSERT INTO customers (name, email, phone, user_id) VALUES (?, ?, ?, ?)",
      [name, email.toLowerCase(), phone || "", userId]
    );
    await connection.end();
    res.status(201).json({
      id: customerResult.insertId,
      name,
      email,
      phone,
      user_id: userId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Este e-mail já está em uso." });
    }
    res.status(500).json({ error: "Erro ao cadastrar cliente e usuário." });
  }
});

// Listar todos os clientes
app.get("/api/customers", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM customers ORDER BY name"
    );
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ error: "Erro no servidor ao buscar clientes." });
  }
});

// Buscar um cliente pelo ID
app.get("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM customers WHERE id = ?",
      [id]
    );
    await connection.end();
    if (rows.length > 0) res.status(200).json(rows[0]);
    else res.status(404).json({ error: "Cliente não encontrado." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cliente." });
  }
});

// Atualizar um cliente
app.put("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email, phone, id]
    );
    await connection.end();
    if (result.affectedRows > 0)
      res.status(200).json({ message: "Cliente atualizado com sucesso." });
    else res.status(404).json({ error: "Cliente não encontrado." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar cliente." });
  }
});

// Deletar um cliente
app.delete("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "DELETE FROM customers WHERE id = ?",
      [id]
    );
    await connection.end();
    if (result.affectedRows > 0)
      res.status(200).json({ message: "Cliente deletado com sucesso." });
    else res.status(404).json({ error: "Cliente não encontrado." });
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor ao deletar cliente." });
  }
});

// --- ROTAS DE QUARTOS (ROOMS) ---

// Listar todos os quartos (lógica unificada)
app.get("/api/rooms", async (req, res) => {
  const { available } = req.query;
  let query = `
    SELECT r.*, c.id as customer_id, c.name as customer_name
    FROM rooms r
    LEFT JOIN bookings b ON r.id = b.room_id AND b.status = 'active'
    LEFT JOIN customers c ON b.customer_id = c.id
    ORDER BY r.name;
  `;
  if (available === "true") {
    query = `SELECT * FROM rooms WHERE is_available = TRUE ORDER BY name;`;
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query);
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar quartos:", error);
    res.status(500).json({ error: "Erro no servidor ao buscar quartos." });
  }
});

// Buscar um quarto pelo ID
app.get("/api/rooms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM rooms WHERE id = ?",
      [id]
    );
    await connection.end();
    if (rows.length > 0) res.status(200).json(rows[0]);
    else res.status(404).json({ error: "Quarto não encontrado." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o quarto." });
  }
});

// Cadastrar um novo quarto
app.post("/api/rooms", upload.single("image"), async (req, res) => {
  const { name, description, capacity, price_per_night } = req.body;

  if (!name || !capacity || !price_per_night) {
    return res
      .status(400)
      .json({ error: "Nome, capacidade e preço são obrigatórios." });
  }

  let image_url = null; // Inicia como nulo

  // <<< CORREÇÃO 1: LÓGICA PARA MOVER A IMAGEM PARA O FRONTEND >>>
  if (req.file) {
    // Define o caminho para a pasta 'public/images' do seu projeto frontend
    const frontendImagesPath = path.resolve(
      __dirname,
      "..",
      "hostly",
      "public",
      "images"
    );

    // Garante que a pasta de destino exista
    if (!fs.existsSync(frontendImagesPath)) {
      fs.mkdirSync(frontendImagesPath, { recursive: true });
    }

    const destPath = path.join(frontendImagesPath, req.file.filename);

    // Move o arquivo da pasta temporária do backend para a pasta do frontend
    fs.renameSync(req.file.path, destPath);

    // Define a URL que o frontend usará para acessar a imagem
    image_url = `/images/${req.file.filename}`;
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      // <<< CORREÇÃO 2: FORÇANDO 'is_available' A SER 'true' NA CRIAÇÃO >>>
      "INSERT INTO rooms (name, description, capacity, price_per_night, is_available, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, capacity, price_per_night, true, image_url]
    );
    await connection.end();
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("ERRO AO SALVAR QUARTO:", error);
    res.status(500).json({ error: "Erro no servidor ao cadastrar o quarto." });
  }
});

// Atualizar um quarto
app.put("/api/rooms/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, description, capacity, price_per_night, is_available } =
    req.body;
  let image_url = req.body.image_url; // Mantém a imagem antiga se uma nova não for enviada
  if (req.file) {
    image_url = `/images/${req.file.filename}`;
  }
  if (!name || !capacity || !price_per_night) {
    return res.status(400).json({ error: "Campos obrigatórios faltando." });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "UPDATE rooms SET name = ?, description = ?, capacity = ?, price_per_night = ?, is_available = ?, image_url = ? WHERE id = ?",
      [
        name,
        description,
        capacity,
        price_per_night,
        is_available,
        image_url,
        id,
      ]
    );
    await connection.end();
    if (result.affectedRows > 0)
      res.status(200).json({ message: "Quarto atualizado com sucesso." });
    else res.status(404).json({ error: "Quarto não encontrado." });
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor ao atualizar o quarto." });
  }
});

// Deletar um quarto
app.delete("/api/rooms/:id", async (req, res) => {
  const { id } = req.params;
  const userRole = req.headers["x-user-role"];
  if (userRole !== "admin") {
    return res
      .status(403)
      .json({ error: "Apenas administradores podem deletar quartos." });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "DELETE FROM rooms WHERE id = ?",
      [id]
    );
    await connection.end();
    if (result.affectedRows > 0)
      res.status(200).json({ message: "Quarto deletado com sucesso." });
    else res.status(404).json({ error: "Quarto não encontrado." });
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor ao deletar o quarto." });
  }
});

// --- ROTAS PARA USUÁRIOS (USERS) ---
// --- ROTA DE RESET DE SENHA POR E-MAIL ---
app.put("/api/users/reset-password-by-email", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "E-mail é obrigatório." });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Verifica se o usuário existe
    const [users] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0) {
      await connection.end();
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    // Gera nova senha aleatória
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    // Atualiza a senha no banco
    await connection.execute("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);
    await connection.end();
    // Retorna a nova senha para exibir no frontend
    res
      .status(200)
      .json({ message: "Senha resetada com sucesso.", newPassword });
  } catch (error) {
    console.error("Erro ao resetar senha:", error);
    res.status(500).json({ error: "Erro no servidor ao resetar senha." });
  }
});

// Cadastrar usuário (cliente ou funcionário)
app.post("/api/users", async (req, res) => {
  const { name, email, password, role = "user" } = req.body; // role 'user' como padrão
  if (!name || !email || !password)
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const connection = await mysql.createConnection(dbConfig);
    // Cria usuário
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email.toLowerCase(), hashedPassword, role]
    );
    const userId = result.insertId;
    // Se for cliente, cria também o registro na tabela customers
    if (role === "user") {
      await connection.execute(
        "INSERT INTO customers (name, email, user_id) VALUES (?, ?, ?)",
        [name, email.toLowerCase(), userId]
      );
    }
    await connection.end();
    res.status(201).json({ id: userId, name, email });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Este e-mail já está em uso." });
    res.status(500).json({ error: "Erro no servidor ao cadastrar usuário." });
  }
});

// O restante das suas rotas de usuário, booking, etc., pode vir aqui,
// --- ROTAS DE BOOKING (CHECK-IN) ---
// Excluir reserva do histórico
app.delete("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "id da reserva é obrigatório." });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Exclui a reserva
    const [result] = await connection.execute(
      "DELETE FROM bookings WHERE id = ? AND status != 'active'",
      [id]
    );
    await connection.end();
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Reserva excluída do histórico." });
    } else {
      res.status(404).json({ error: "Reserva não encontrada ou ainda ativa." });
    }
  } catch (error) {
    console.error("Erro ao excluir reserva:", error);
    res.status(500).json({ error: "Erro no servidor ao excluir reserva." });
  }
});
// Cancelar reserva (cliente)
app.post("/api/bookings/cancel", async (req, res) => {
  const { booking_id } = req.body;
  if (!booking_id) {
    return res.status(400).json({ error: "booking_id é obrigatório." });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Atualiza o status da reserva para 'cancelled'
    const [result] = await connection.execute(
      "UPDATE bookings SET status = 'cancelled', check_out_date = NOW() WHERE id = ? AND status = 'active'",
      [booking_id]
    );
    // Torna o quarto disponível novamente
    await connection.execute(
      "UPDATE rooms SET is_available = TRUE WHERE id = (SELECT room_id FROM bookings WHERE id = ?)",
      [booking_id]
    );
    await connection.end();
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Reserva cancelada com sucesso." });
    } else {
      res
        .status(404)
        .json({ error: "Reserva não encontrada ou já cancelada." });
    }
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    res.status(500).json({ error: "Erro no servidor ao cancelar reserva." });
  }
});
// --- ROTA PARA LISTAR RESERVAS DO USUÁRIO ---
app.get("/api/bookings", async (req, res) => {
  // Permite buscar por customer_id ou user_id via query
  const { customer_id, user_id, all } = req.query;
  try {
    const connection = await mysql.createConnection(dbConfig);
    let query =
      "SELECT b.*, r.name as room_name, r.image_url, c.name as customer_name FROM bookings b " +
      "JOIN rooms r ON b.room_id = r.id " +
      "JOIN customers c ON b.customer_id = c.id ";
    let params = [];
    if (all === "true") {
      // Retorna todas as reservas
      query += "ORDER BY b.check_in_date DESC";
    } else if (customer_id) {
      query += "WHERE b.customer_id = ? ORDER BY b.check_in_date DESC";
      params.push(customer_id);
    } else if (user_id) {
      query +=
        "JOIN users u ON c.user_id = u.id WHERE u.id = ? ORDER BY b.check_in_date DESC";
      params.push(user_id);
    } else {
      await connection.end();
      return res
        .status(400)
        .json({ error: "customer_id, user_id ou all=true são obrigatórios." });
    }
    const [rows] = await connection.execute(query, params);
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    res.status(500).json({ error: "Erro no servidor ao buscar reservas." });
  }
});
// --- ROTA DE CHECK-OUT ---
app.post("/api/bookings/check-out", async (req, res) => {
  const { room_id } = req.body;
  if (!room_id) {
    return res.status(400).json({ error: "room_id é obrigatório." });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Atualiza o status da reserva ativa para 'completed' (ou 'cancelled')
    await connection.execute(
      "UPDATE bookings SET status = 'completed', check_out_date = NOW() WHERE room_id = ? AND status = 'active'",
      [room_id]
    );
    // Torna o quarto disponível novamente
    await connection.execute(
      "UPDATE rooms SET is_available = TRUE WHERE id = ?",
      [room_id]
    );
    await connection.end();
    res.status(200).json({ message: "Check-out realizado com sucesso." });
  } catch (error) {
    console.error("Erro ao fazer check-out:", error);
    res.status(500).json({ error: "Erro no servidor ao fazer check-out." });
  }
});

app.post("/api/bookings/check-in", async (req, res) => {
  const { room_id, customer_id } = req.body;
  if (!room_id || !customer_id) {
    return res
      .status(400)
      .json({ error: "room_id e customer_id são obrigatórios." });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Cria o registro de booking
    await connection.execute(
      "INSERT INTO bookings (room_id, customer_id, status, check_in_date) VALUES (?, ?, 'active', NOW())",
      [room_id, customer_id]
    );
    // Atualiza o status do quarto para indisponível
    await connection.execute(
      "UPDATE rooms SET is_available = FALSE WHERE id = ?",
      [room_id]
    );
    await connection.end();
    res.status(200).json({ message: "Check-in realizado com sucesso." });
  } catch (error) {
    console.error("Erro ao fazer check-in:", error);
    res.status(500).json({ error: "Erro no servidor ao fazer check-in." });
  }
});
// seguindo a mesma estrutura limpa.

// --- 6. INICIAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
