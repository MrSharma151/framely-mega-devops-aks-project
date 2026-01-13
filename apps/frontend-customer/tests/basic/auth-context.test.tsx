import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  it("hydrates safely on mount", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.hydrated).toBe(true);
  });

  it("login stores user and token", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({
        userId: "1",
        fullName: "Test User",
        email: "test@test.com",
        role: "Customer",
        token: "jwt-token",
        expiresAt: "2026-01-01",
      });
    });

    expect(result.current.token).toBe("jwt-token");
    expect(result.current.user?.email).toBe("test@test.com");
  });

  it("logout clears auth state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
