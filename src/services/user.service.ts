import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import { User } from "../models/user.model";

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
  const hashedPassword = await bcrypt.hash(user.password, 12);

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
