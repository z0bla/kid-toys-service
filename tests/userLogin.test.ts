import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import request from "supertest";

import { STATUS_CODES } from "../src/utils/constants";

import { PrismaUser, prismaMock } from "../singleton";
import app from "../src/server";

import ResolvedValue = jest.ResolvedValue;

describe("User login", () => {
  const email = "test1@test.com";
  const password = "Test123Pass!";
  const existingUser = { email, password } as ResolvedValue<PrismaUser>;

  it("should return 201 for existing user and correct password", async () => {
    const data = { email, password };

    prismaMock.user.findUnique.mockResolvedValue(existingUser);
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
    (jwt.sign as jest.Mock) = jest.fn().mockResolvedValue("generated_token");

    await request(app).post("/api/login").send(data).expect(STATUS_CODES.OK);
  });

  it("should return 401 for non existing user", async () => {
    const data = { email, password };

    prismaMock.user.findUnique.mockResolvedValue(null);

    await request(app)
      .post("/api/login")
      .send(data)
      .expect(STATUS_CODES.UNAUTHORIZED);
  });

  it("should return 401 for invalid password", async () => {
    const data = { email, password };

    prismaMock.user.findUnique.mockResolvedValue(existingUser);
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);

    await request(app)
      .post("/api/login")
      .send(data)
      .expect(STATUS_CODES.UNAUTHORIZED);
  });
});
