jest.mock("@/services/apiClient", () => ({
  __esModule: true,
  default: require("../mocks/apiClient.mock").default,
}));


import apiClient from "@/services/apiClient";
import { loginUser, logoutUser } from "@/services/authService";
import Cookies from "js-cookie";

jest.mock("js-cookie");

describe("authService", () => {
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

  it("should clear cookies on logout", () => {
    logoutUser();
    expect(Cookies.remove).toHaveBeenCalledWith("token");
    expect(Cookies.remove).toHaveBeenCalledWith("user");
  });
});
