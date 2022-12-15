import express from "express";
import prisma from "./prisma";

const app = express();
const port = "5000";

async function connectDb() {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (err) {
    console.log("Error connectig to database: ", err);
  }
}

connectDb();

// app.get("/", async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users).end("Prisma is running!");
// });

app.get("/", (req, res) => {
  // prisma.user.findMany().then((users) => {
  //   res.json("users").end("Prisma is running");
  // });
  const users = prisma.user.findMany();
  res.end(users);
});

app.listen(port, () => {
  console.log("Server is listening...");
});
