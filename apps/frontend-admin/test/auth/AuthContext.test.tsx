import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "@/context/AuthContext";

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
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should render AuthProvider and hydrate", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId("hydrated")).toHaveTextContent("true");
  });

  it("should allow ADMIN login and store data in localStorage", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "token",
      "fake-token"
    );

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      expect.any(String)
    );
  });

  it("should clear localStorage on logout", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Logout").click();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });
});
