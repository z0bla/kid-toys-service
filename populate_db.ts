import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        firstName: "Dalibor",
        lastName: "Blazanovic",
      },
      {
        firstName: "Dejan",
        lastName: "Blazanovic",
      },
      {
        firstName: "Nemanja",
        lastName: "Vasic",
      },
      {
        firstName: "Goran",
        lastName: "Stevanovic",
      },
    ],
  });
  console.log(users);

  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
