import request from "supertest";

import app from "../src/server";
import { prismaMock, PrismaUser } from "../singleton";
import { Role, User } from "../src/models/user.model";
import ResolvedValue = jest.ResolvedValue;
import { Prisma } from "@prisma/client";

const baseUrl = "http://localhost:5000";

interface RequestData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: number | string;
  address?: string;
  email?: string;
  password?: string;
}

function sendRegisterPostRequest(data: RequestData) {
  return request(app).post("/api/register").send(data);
}

describe("User Registration", () => {
  describe("Successful registration", () => {
    test("User can be created with only email and password provided", async () => {
      const data = {
        email: "test1@test.com",
        password: "Test123Pass!",
      };

      const user = {
        email: "test1@test.com",
        password: "Test123Pass!",
      } as ResolvedValue<PrismaUser>;

      prismaMock.user.create.mockResolvedValue(user);

      await sendRegisterPostRequest(data).expect(201);
    });

    test("User can be created with all details provided", async () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: 1555123456,
        address: "123 Main Street, New York, USA",
        email: "test2@test.com",
        password: "Test123Pass!",
      };

      const user = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: 1555123456,
        address: "123 Main Street, New York, USA",
        email: "test2@test.com",
        password: "Test123Pass!",
      } as ResolvedValue<PrismaUser>;

      prismaMock.user.create.mockResolvedValue(user);

      await sendRegisterPostRequest(data).expect(201);
    });
  });

  describe("Unsuccessful registration", () => {
    test("User can't use already taken email address", async () => {
      const data = {
        email: "test@test.com",
        password: "Test123Pass!",
      };

      const user = {
        id: 123,
        firstName: "firstName",
        lastName: "lastName",
        phoneNumber: 123123123,
        address: "asf",
        email: "email@email.com",
        password: "Password!12312",
        role: Role.admin,
      } as ResolvedValue<PrismaUser>;

      prismaMock.user.findUnique.mockResolvedValue(user);

      await sendRegisterPostRequest(data).expect(409);
    });

    test("User can't register without providing an email address", async () => {
      const res = await sendRegisterPostRequest({
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register without providing a password", async () => {
      const res = await sendRegisterPostRequest({
        email: "test@test.com",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with too long first name", async () => {
      const res = await sendRegisterPostRequest({
        firstName: "A really really really really really long name",
        email: "test@test.com",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with too long last name", async () => {
      const res = await sendRegisterPostRequest({
        lastName: "A really really really really really long name",
        email: "test@test.com",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with non-numeric phone number", async () => {
      const res = await sendRegisterPostRequest({
        phoneNumber: "12345aa",
        email: "test@test.com",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with invalid email address", async () => {
      const res = await sendRegisterPostRequest({
        email: "test@test",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with too short password", async () => {
      const res = await sendRegisterPostRequest({
        email: "test@test.com",
        password: "testTEST12!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with invalid password (no lowercase letters)", async () => {
      const res = await sendRegisterPostRequest({
        email: "test@test.com",
        password: "TESTPASS123!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with invalid password (no uppercase letters)", async () => {
      const res = await sendRegisterPostRequest({
        email: "test@test.com",
        password: "testpass123!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with invalid password (no numbers)", async () => {
      const res = await sendRegisterPostRequest({
        email: "test@test.com",
        password: "testTESTtest!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with invalid password (no symbols)", async () => {
      const res = await sendRegisterPostRequest({
        email: "test@test.com",
        password: "testTEST12345",
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
