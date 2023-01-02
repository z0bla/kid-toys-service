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

async function main() {
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async(e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

app.listen(port, () => {
  console.log("Server is listening...");
});
