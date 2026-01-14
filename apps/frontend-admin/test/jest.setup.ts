// test/jest.setup.ts

/**
 * Global Jest setup file
 * Runs before every test suite.
 */

import "@testing-library/jest-dom";

/**
 * Mock Next.js navigation utilities
 * Prevents real routing during tests.
 */
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
}));

/**
 * Silence console errors/warnings in CI output
 */
jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});
