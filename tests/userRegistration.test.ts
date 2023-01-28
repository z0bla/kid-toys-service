import request from "supertest";
import app from "../src/server";
import prisma from "../src/utils/prisma";

describe("User Registration", () => {
  describe("Successful registration", () => {
    afterAll(async () => {
      await prisma.user.deleteMany({
        where: {
          email: {
            contains: "test.com",
          },
        },
      });
    });

    test("User can be created with only email and password provided", async () => {
      const res = await request(app).post("/api/register").send({
        email: "test1@test.com",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        status: "success",
        message: "User created successfully",
      });
    });

    test("User can be created with all details provided", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        phoneNumber: 1555123456,
        address: "123 Main Street, New York, USA",
        email: "test2@test.com",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        status: "success",
        message: "User created successfully",
      });
    });
  });

  describe("Unsuccessful registration", () => {
    test("User can't use already taken email address", async () => {
      await request(app).post("/api/register").send({
        email: "test@test.com",
        password: "Test123Pass!",
      });

      const res = await request(app).post("/api/register").send({
        email: "test@test.com",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(409);

      prisma.user.delete({
        where: {
          email: "test@test.com",
        },
      });
    });

    test("User can't register without providing an email address", async () => {
      const res = await request(app).post("/api/register").send({
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register without providing a password", async () => {
      const res = await request(app).post("/api/register").send({
        email: "test@test.com",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with too long first name", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "A really really really really really long name",
        email: "test@test.com",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with too long last name", async () => {
      const res = await request(app).post("/api/register").send({
        lastName: "A really really really really really long name",
        email: "test@test.com",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(400);
    });

    test("User can't register with non-numeric phone number", async () => {
      const res = await request(app).post("/api/register").send({
        phoneNumber: "12345aa",
        email: "test@test.com",
        password: "Test123Pass!",
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
