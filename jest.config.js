const config = {
  clearMocks: true,
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/singleton.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
};

module.exports = config;
