// test/mocks/axios.mock.ts

/**
 * Global axios mock
 * Prevents real network calls during tests.
 */

const axiosMock = {
  create: jest.fn(() => axiosMock),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

export default axiosMock;
