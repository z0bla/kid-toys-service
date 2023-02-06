import nock from "nock";
import request from "supertest";

import app from "../src/server";

const baseUrl = "http://localhost:5000";

interface RequestData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: number | string;
  address?: string;
  email?: string;
  password?: string;
}

async function sendRegisterPostRequest(data: RequestData) {
  const res = await request(app).post("/api/register").send(data);
  return res;
}

describe("User Registration", () => {
  describe("Successful registration", () => {
    test("User can be created with only email and password provided", async () => {
      const res = await sendRegisterPostRequest({
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
      const res = await sendRegisterPostRequest({
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
      nock(baseUrl).post("/api/register").reply(409);

      const data = {
        email: "test@test.com",
        password: "Test123Pass!",
      };

      const res = await request(app).post("/api/register").send(data);
      console.log(res.statusCode);

      expect(res.statusCode).toBe(409);
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
