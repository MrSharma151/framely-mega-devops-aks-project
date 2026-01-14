// test/mocks/toast.mock.ts

/**
 * Mock for react-hot-toast
 * Prevents real UI notifications during tests.
 */

export const toast = {
  success: jest.fn(),
  error: jest.fn(),
};

export default toast;
