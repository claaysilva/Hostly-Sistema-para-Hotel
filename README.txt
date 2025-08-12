Comandos

Inicializar o banco de dados: cd hostly-api \ npm run db:setup

Criar uma migração: npx knex migrate:make (nome da migração)

Rodar as migrações: npx knex migrate:latest

Rodar a API e o Front: npm run dev

Rodar a seed com o usuário principal(caso não exista): npm run db:seed
