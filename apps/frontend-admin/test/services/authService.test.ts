jest.mock("@/services/apiClient", () => ({
  __esModule: true,
  default: require("../mocks/apiClient.mock").default,
}));

import apiClient from "@/services/apiClient";
import { loginUser, logoutUser } from "@/services/authService";

describe("authService", () => {
  it("should call login API and return response data", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { token: "fake-token" },
    });

    const res = await loginUser({
      email: "admin@test.com",
      password: "123456",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/Auth/login", {
      email: "admin@test.com",
      password: "123456",
    });

    expect(res.token).toBe("fake-token");
  });

  it("should clear localStorage and redirect on logout", () => {
    logoutUser();

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });
});
