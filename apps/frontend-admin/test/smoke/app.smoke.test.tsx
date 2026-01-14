import React from "react";
import { render } from "@testing-library/react";
import DashboardPage from "@/app/page";
import { AuthProvider } from "@/context/AuthContext";

jest.mock("@/components/ui/dashboard/ProductMetrics", () => () => <div />);
jest.mock("@/components/ui/dashboard/RevenueTrend", () => () => <div />);
jest.mock("@/components/ui/dashboard/RecentOrders", () => () => <div />);
jest.mock("@/components/ui/dashboard/TopSellingProducts", () => () => <div />);
jest.mock("@/components/ui/dashboard/LowStockAlerts", () => () => <div />);

describe("App Smoke Test", () => {
  it("renders dashboard without crashing", () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );

    expect(true).toBe(true);
  });
});
