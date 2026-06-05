import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("DersLoop123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@dersloop.app" },
    update: {},
    create: {
      name: "DersLoop Admin",
      email: "admin@dersloop.app",
      passwordHash,
      role: "ADMIN",
    },
  });

  const defaultPrompts = [
    {
      key: "summary_prompt",
      value:
        "Verilen ders notunu öğrenci için anlaşılır bir özet haline getir. Ana kavramları, formülleri ve önemli noktaları vurgula.",
    },
    {
      key: "video_cards_prompt",
      value:
        "Ders notundan 15-40 saniyelik Reels tarzı öğrenme kartları oluştur. Her kart tek bir konuyu anlatsın.",
    },
    {
      key: "podcast_prompt",
      value:
        "Ders notundan samimi, gençlere hitap eden bir podcast scripti yaz. Doğal konuşma dili kullan.",
    },
  ];

  for (const prompt of defaultPrompts) {
    await prisma.setting.upsert({
      where: { key: prompt.key },
      update: { value: prompt.value },
      create: prompt,
    });
  }

  console.log("Seed completed: admin@dersloop.app / DersLoop123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
