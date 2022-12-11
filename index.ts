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

app.get("/*", (req, res) => {
  res.end("Uspjelo Nukrec!");
});

app.listen(port, () => {
  console.log("Server is listening...");
});
