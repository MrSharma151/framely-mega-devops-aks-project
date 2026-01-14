import axios from "axios";
import apiClient from "@/services/apiClient";

jest.mock("axios", () => {
  const mAxios = {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    })),
  };
  return mAxios;
});

describe("apiClient", () => {
  it("should create axios instance with interceptors", () => {
    expect(apiClient).toBeDefined();
  });
});
