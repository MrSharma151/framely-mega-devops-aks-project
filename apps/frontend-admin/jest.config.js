/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",

  roots: ["<rootDir>/test"],

  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },

  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};
