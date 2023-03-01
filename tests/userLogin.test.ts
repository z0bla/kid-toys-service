import request from "supertest";

import { Role } from "../src/models/user.model";

import { STATUS_CODES } from "../src/utils/constants";

import { PrismaUser, prismaMock } from "../singleton";
import app from "../src/server";

import ResolvedValue = jest.ResolvedValue;

describe("User login", () => {
  const email = "test1@test.com";
  const password = "Test123Pass!";

  it("Should log in an existing user", async () => {
    const email = "test1@test.com";
    const password = "Test123Pass!";

    const data = { email, password };
    const existingUser = { email, password } as ResolvedValue<PrismaUser>;

    prismaMock.user.findUnique.mockResolvedValue(existingUser);

    await request(app).post("/api/login").send(data).expect(STATUS_CODES.OK);
  });

  it("Should not log in non existing user", async () => {
    const data = { email: "test2@test.com", password: "Test123456Pass?" };

    await request(app)
      .post("/api/login")
      .send(data)
      .expect(STATUS_CODES.UNAUTHORIZED);
  });
});
