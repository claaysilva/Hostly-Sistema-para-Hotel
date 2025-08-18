// src/data/rooms.js

/**
 * rooms.js
 * Dados de quartos utilizados no frontend do sistema Hostly.
 *
 * Estrutura de dados para exibição e testes de funcionalidades de reserva.
 *
 * Manutenção: Atualize os dados conforme necessidade do hotel ou ambiente de testes.
 * Última revisão: 18/08/2025
 * Autor: Equipe de Engenharia Hostly
 */
export const roomsData = [
  {
    id: 1,
    name: "Dormitório Coletivo Sol",
    capacity: 8,
    price_per_night: 75.0,
    is_available: true,
    description:
      "Um dormitório espaçoso e ensolarado com beliches confortáveis e armários individuais.",
  },
  {
    id: 2,
    name: "Dormitório Coletivo Lua",
    capacity: 6,
    price_per_night: 80.0,
    is_available: false,
    description:
      "Perfeito para quem busca um ambiente mais tranquilo. Possui luzes de leitura individuais.",
  },
  {
    id: 3,
    name: "Suíte Privativa Estrela",
    capacity: 2,
    price_per_night: 180.0,
    is_available: true,
    description:
      "Uma suíte confortável com cama de casal, banheiro privativo e uma bela vista para a cidade.",
  },
  {
    id: 4,
    name: "Quarto Família Cometa",
    capacity: 4,
    price_per_night: 250.0,
    is_available: true,
    description:
      "Ideal para famílias ou pequenos grupos. Contém uma cama de casal e um beliche.",
  },
];
