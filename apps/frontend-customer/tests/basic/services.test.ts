import apiClient from "@/services/apiClient";
import { getProducts } from "@/services/productService";

// 🔥 Directly mock apiClient (BEST PRACTICE)
jest.mock("@/services/apiClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

describe("Service layer", () => {
  it("fetches products successfully", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
        data: [{ id: 1, name: "Test Product", price: 100 }],
      },
    });

    const res = await getProducts();

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(res.data.length).toBe(1);
    expect(res.data[0].name).toBe("Test Product");
  });
});
