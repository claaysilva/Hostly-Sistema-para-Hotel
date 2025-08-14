# Hostly - Sistema para Hotel

Sistema completo para gestão de hotel, com frontend em React e backend em Node.js/Express + MySQL.

## Funcionalidades

- Cadastro e login de clientes, funcionários e administradores
- Reserva de quartos com check-in/check-out
- Cancelamento e exclusão de reservas
- Histórico de reservas para clientes e admin/funcionários
- Filtros avançados por cliente, quarto, status e data
- Gerenciamento de quartos, clientes e funcionários
- Interface moderna, responsiva e com modais estilizados

```
Hostly-Sistema-para-Hotel/
├── hostly-api/        # Backend (Node.js/Express)
├── hostly/            # Frontend (React + Vite)
├── .gitignore
├── README.md
```

## Requisitos

- Node.js >= 18
- MySQL >= 8

## Como clonar e rodar o projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/claaysilva/Hostly-Sistema-para-Hotel.git
   cd Hostly-Sistema-para-Hotel
   ```

2. **Configure o banco de dados MySQL:**

   - Crie um banco de dados chamado `hostly` (ou ajuste o nome no arquivo `.env` do backend).
   - Crie um usuário e senha para o banco.
   - Execute as migrations e seeds para criar as tabelas e dados iniciais.

3. **Configuração do Backend (hostly-api):**

   ```bash
   cd hostly-api
   cp .env.example .env   # Crie o arquivo .env com suas credenciais do MySQL
   npm install
   npx knex migrate:latest
   npx knex seed:run
   npm start
   ```

   O backend estará rodando em `http://localhost:3001`

4. **Configuração do Frontend (hostly):**
   ```bash
   cd ../hostly
   npm install
   npm run dev
   ```
   O frontend estará rodando em `http://localhost:5173` (ou porta informada pelo Vite)

## Observações

- O arquivo `.env` do backend deve conter as variáveis de conexão do MySQL:
  ```env
  DB_HOST=localhost
  DB_USER=seu_usuario
  DB_PASSWORD=sua_senha
  DB_NAME=hostly
  ```
- Para produção, ajuste as variáveis conforme o serviço de nuvem utilizado.
- O sistema já inclui um favicon personalizado.

## Licença

Este projeto é open-source e pode ser usado livremente para fins educacionais e comerciais.

---

Dúvidas ou sugestões? Abra uma issue ou entre em contato!
