// test/services/authService.test.ts

import apiClient from "@/services/apiClient";
import { loginUser, logoutUser } from "@/services/authService";

jest.mock("@/services/apiClient", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    // 🔥 mock localStorage methods
    jest.spyOn(Storage.prototype, "removeItem");
    jest.spyOn(Storage.prototype, "setItem");
    jest.spyOn(Storage.prototype, "getItem");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call login API and return response data", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { token: "fake-token" },
    });

    const res = await loginUser({
      email: "admin@test.com",
      password: "123456",
    });

    expect(apiClient.post).toHaveBeenCalled();
    expect(res.token).toBe("fake-token");
  });

  it("should clear localStorage on logout", () => {
    logoutUser();

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });
});
