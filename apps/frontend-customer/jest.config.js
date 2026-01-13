/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",

  rootDir: ".",

  testMatch: [
    "<rootDir>/tests/**/*.test.ts",
    "<rootDir>/tests/**/*.test.tsx",
  ],

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
  ],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
};
