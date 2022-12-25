import express from "express";
import prisma from "./prisma";
import logger from "./logger";

const app = express();
const port = "5000";

async function connectDb() {
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (err) {
    logger.error("Error connectig to database: ", err);
  }
}

connectDb();

app.get("/", async (req, res) => {
  // prisma.user
  //   .create({
  //     data: {
  //       firstName: "D",
  //       lastName: "Blazanovic",
  //     },
  //   })
  //   .then(() => {
  //     res.end("user created");
  //   })
  //   .catch((err) => {
  //     res.end(`Error: ${err}`);
  //   });
  const users = await prisma.user.findMany();
  logger.info(users);
  res.json(users).end();
});

app.get("/delete", async (req, res) => {
  await prisma.user.deleteMany({});
  res.end("All records deleted");
});

app.listen(port, () => {
  console.log("Server is listening...");
});
