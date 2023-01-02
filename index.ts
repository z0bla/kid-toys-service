import express from "express";
import prisma from "./prisma";
import logger from "./logger";
import { resolve } from "path";

const app = express();
const port = "3000";

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
  app.get('/', function(req, res){
    res.render('index.ejs');
  });
  // app.get('/',async(req,res) =>{
  //   const users = await prisma.user.findMany()
  //   res.json(users)
  // })
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
