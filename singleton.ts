import { PrismaClient, Prisma } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import prisma from "./src/utils/prisma";

jest.mock("./src/utils/prisma", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export type PrismaUser = Prisma.userGetPayload<{}>;

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
