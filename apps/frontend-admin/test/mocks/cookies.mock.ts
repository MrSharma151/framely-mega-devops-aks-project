// test/mocks/cookies.mock.ts

/**
 * Mock for js-cookie
 * Avoids using real browser cookies in tests.
 */

export const get = jest.fn();
export const set = jest.fn();
export const remove = jest.fn();

export default {
  get,
  set,
  remove,
};
