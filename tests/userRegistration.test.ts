import request from "supertest";

import { Role } from "../src/models/user.model";

import { sendConfirmationEmail } from "../src/services/email.service";

import { STATUS_CODES } from "../src/utils/constants";

import { PrismaUser, prismaMock } from "../singleton";
import app from "../src/server";

import ResolvedValue = jest.ResolvedValue;

jest.mock("../src/services/email.service", () => ({
  sendConfirmationEmail: jest.fn(),
}));

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
  const firstName = "John";
  const lastName = "Doe";
  const phoneNumber = 123123123;
  const address = "123 Main Street, New York, USA";
  const email = "test1@test.com";
  const password = "Test123Pass!";

  describe("Successful registration", () => {
    it("should create 'user' with only email and password provided", async () => {
      const data = { email, password };
      const userToCreate = { email, password } as ResolvedValue<PrismaUser>;

      prismaMock.user.create.mockResolvedValue(userToCreate);

      await sendRegisterPostRequest(data).expect(STATUS_CODES.CREATED);
    });

    it("should create 'user' with all details provided", async () => {
      const data = {
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password,
      };
      const mockedUserFromPrisma = {
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password,
      } as ResolvedValue<PrismaUser>;

      prismaMock.user.create.mockResolvedValue(mockedUserFromPrisma);

      await sendRegisterPostRequest(data).expect(STATUS_CODES.CREATED);
    });

    it("should send a confirmation email", async () => {
      const data = { email, password };
      const userToCreate = { email, password } as ResolvedValue<PrismaUser>;

      prismaMock.user.create.mockResolvedValue(userToCreate);

      await sendRegisterPostRequest(data);

      expect(sendConfirmationEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("Unsuccessful registration", () => {
    it("should not be able to register with already taken email", async () => {
      const data = { email, password };
      const mockedExistingUser = {
        id: 123,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password,
        role: Role.admin,
      } as ResolvedValue<PrismaUser>;

      prismaMock.user.findUnique.mockResolvedValue(mockedExistingUser);

      await sendRegisterPostRequest(data).expect(STATUS_CODES.CONFLICT);
    });

    it("should not send a confirmation email", async () => {
      const data = { email, password };
      const mockedExistingUser = {
        id: 123,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password,
        role: Role.admin,
      } as ResolvedValue<PrismaUser>;

      prismaMock.user.findUnique.mockResolvedValue(mockedExistingUser);

      await sendRegisterPostRequest(data);

      expect(sendConfirmationEmail).not.toHaveBeenCalled();
    });

    it("should not be able to register user without email", async () => {
      await sendRegisterPostRequest({ password })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe('"email" is required');
        });
    });

    it("should not be able to register user without password", async () => {
      await sendRegisterPostRequest({ email })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe('"password" is required');
        });
    });

    it("should not be able to register with too long firstName", async () => {
      await sendRegisterPostRequest({
        firstName: "A really really really really really long name",
        email,
        password,
      })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe(
            '"firstName" length must be less than or equal to 45 characters long'
          );
        });
    });

    it("should not be able to register with too long lastName", async () => {
      await sendRegisterPostRequest({
        lastName: "A really really really really really long name",
        email,
        password,
      })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe(
            '"lastName" length must be less than or equal to 45 characters long'
          );
        });
    });

    it("should not be able to register with invalid phone number", async () => {
      await sendRegisterPostRequest({
        phoneNumber: "12345aa",
        email,
        password,
      })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe('"phoneNumber" must be a number');
        });
    });

    it("should not be able to register with too short password", async () => {
      await sendRegisterPostRequest({
        email: "test@test.com",
        password: "testTEST12!",
      })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe(
            '"password" with value "testTEST12!" fails to match the required pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{12,}$/'
          );
        });
    });

    it("should not be able to register with invalid password (no lowercase letters)", async () => {
      await sendRegisterPostRequest({
        email: "test@test.com",
        password: "TESTPASS123!",
      })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe(
            '"password" with value "TESTPASS123!" fails to match the required pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{12,}$/'
          );
        });
    });

    it("should not be able to register with invalid password (no uppercase letters)", async () => {
      await sendRegisterPostRequest({
        email: "test@test.com",
        password: "testpass123!",
      })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe(
            '"password" with value "testpass123!" fails to match the required pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{12,}$/'
          );
        });
    });

    it("should not be able to register with invalid password (no numbers)", async () => {
      await sendRegisterPostRequest({
        email: "test@test.com",
        password: "testTESTtest!",
      })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe(
            '"password" with value "testTESTtest!" fails to match the required pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{12,}$/'
          );
        });
    });

    it("should not be able to register with invalid password (no symbols)", async () => {
      await sendRegisterPostRequest({
        email: "test@test.com",
        password: "testTEST12345",
      })
        .expect(STATUS_CODES.BAD_REQUEST)
        .expect((body) => {
          const text = JSON.parse(body.text);
          expect(text.message).toBe(
            '"password" with value "testTEST12345" fails to match the required pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{12,}$/'
          );
        });
    });
  });
});
