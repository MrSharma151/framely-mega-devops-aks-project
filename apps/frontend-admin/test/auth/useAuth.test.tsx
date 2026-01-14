// test/auth/useAuth.test.ts

import React from "react";
import { renderHook } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/context/AuthContext";

/**
 * Wrapper to provide AuthContext for hook testing
 */
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("useAuth hook", () => {
  it("should return auth context when used inside AuthProvider", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty("user");
    expect(result.current).toHaveProperty("login");
    expect(result.current).toHaveProperty("logout");
    expect(result.current).toHaveProperty("hydrated");
  });

  it("should throw error when used outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an <AuthProvider />");
  });
});
