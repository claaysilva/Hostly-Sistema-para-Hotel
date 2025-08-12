// db/seeds/03_add_rooms.js
exports.seed = async function (knex) {
  const roomsCount = await knex("rooms").count("id as count").first();
  if (roomsCount.count > 0) {
    return; // Pula se já tiver quartos
  }

  console.log("Populando a tabela de quartos...");
  return knex("rooms").insert([
    {
      name: "Quarto Individual",
      description:
        "Ideal para viajantes individuais. Oferece uma cama de solteiro confortável, banheiro privativo, ar-condicionado, TV e Wi-Fi gratuito.",
      capacity: 1,
      price_per_night: 150.0,
      is_available: true,
      image_url: "/images/Individual.png",
    },
    {
      name: "Quarto Duplo",
      description:
        "Perfeito para casais ou dois amigos. Equipado com uma cama de casal ou duas de solteiro, banheiro privativo, TV e Wi-Fi gratuito.",
      capacity: 2,
      price_per_night: 220.0,
      is_available: true,
      image_url: "/images/Duplo.png",
    },
    {
      name: "Quarto Triplo",
      description:
        "Espaçoso e confortável para famílias pequenas ou grupos de amigos. Possui uma cama de casal e uma de solteiro (ou três de solteiro).",
      capacity: 3,
      price_per_night: 300.0,
      is_available: true,
      image_url: "/images/Triplo.png",
    },
    {
      name: "Suíte Executiva",
      description:
        "Uma opção mais luxuosa para quem busca conforto extra. A suíte inclui uma cama king-size e área de estar separada.",
      capacity: 2,
      price_per_night: 450.0,
      is_available: true,
      image_url: "/images/Executiva.png",
    },
    {
      name: "Suíte Família",
      description:
        "Completa para famílias grandes. Conta com um quarto principal com cama de casal e um quarto anexo com duas camas de solteiro.",
      capacity: 4,
      price_per_night: 500.0,
      is_available: true,
      image_url: "/images/Familia.png",
    },
  ]);
};
