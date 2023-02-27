import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model";

import prisma from "../utils/prisma";

require("dotenv").config();

const saltRounds = 12;

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = (await prisma.user.findUnique({
    where: {
      email,
    },
  })) as User;

  return user ?? null;
}

export async function createUser(user: User): Promise<User> {
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  return (await prisma.user.create({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
      password: hashedPassword,
      role: user.role,
    },
  })) as User;
}

export async function isPasswordValid(user: User, password: string) {
  return await bcrypt.compare(user.password, password);
}

export function generateAccessToken(data: { id: number; role: string }) {
  return jwt.sign(data, process.env.TOKEN_SECRET as string, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
}
