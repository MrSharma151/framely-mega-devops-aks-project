// test/auth/AuthContext.test.tsx

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "@/context/AuthContext";
import Cookies from "js-cookie";

/**
 * Mock js-cookie to avoid real browser cookies
 */
jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

/**
 * Test component to consume AuthContext
 */
const TestConsumer = () => {
  const auth = React.useContext(AuthContext);

  if (!auth) return null;

  return (
    <div>
      <span data-testid="hydrated">
        {auth.hydrated ? "true" : "false"}
      </span>
      <button
        onClick={() =>
          auth.login({
            userId: "1",
            fullName: "Admin User",
            email: "admin@test.com",
            role: "ADMIN",
            token: "fake-token",
            expiresAt: "2026-01-01",
            refreshToken: null,
          })
        }
      >
        Login
      </button>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  it("should render AuthProvider and hydrate", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId("hydrated")).toHaveTextContent("true");
  });

  it("should allow ADMIN login", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(Cookies.set).toHaveBeenCalledWith(
      "token",
      "fake-token",
      expect.any(Object)
    );
    expect(Cookies.set).toHaveBeenCalledWith(
      "user",
      expect.any(String),
      expect.any(Object)
    );
  });

  it("should clear cookies on logout", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Logout").click();
    });

    expect(Cookies.remove).toHaveBeenCalledWith("token");
    expect(Cookies.remove).toHaveBeenCalledWith("user");
  });
});
