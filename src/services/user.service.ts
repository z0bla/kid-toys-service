import bcrypt from "bcryptjs";

import { User } from "../models/user.model";
import prisma from "../utils/prisma";

const saltRounds = 12;

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = (await prisma.user.findUnique({
    where: {
      email,
    },
  })) as User;

  if (user) {
    return user;
  } else {
    return null;
  }
}

export async function createUser(user: User): Promise<User> {
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  const newUser = (await prisma.user.create({
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

  return newUser;
}
