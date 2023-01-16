import express from "express";
import prisma from "./prisma";
import logger from "./logger";

const app = express();
const port = "5000";

async function connectDb() {
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (error) {
    logger.error("Error connecting to database: ", error);
  }
}

connectDb();

app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    logger.info(users);
    res.json(users).end();
  } catch (error) {
    logger.error(error);
    res.end("Error occurred: " + error);
  }
});

app.get("/add", async (req, res) => {
  prisma.user
    .create({
      data: {
        firstName: "D",
        lastName: "Blazanovic",
      },
    })
    .then(() => {
      res.end("user created");
    })
    .catch((error) => {
      logger.error(error);
      res.end(`Error: ${error}`);
    });
});

app.get("/delete", async (req, res) => {
  await prisma.user.deleteMany({});
  res.end("All records deleted");
});

app.listen(port, () => {
  console.log("Server is listening...");
});
