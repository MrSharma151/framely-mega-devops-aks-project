jest.mock("@/services/apiClient", () => ({
  __esModule: true,
  default: require("../mocks/apiClient.mock").default,
}));

import apiClient from "@/services/apiClient";
import * as CategoryService from "@/services/CategoryService";
import * as ProductService from "@/services/ProductService";
import * as OrderService from "@/services/OrderService";
import * as ImageService from "@/services/imageService";


describe("Core Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch categories", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: { data: [] } });

    const res = await CategoryService.getCategories();
    expect(apiClient.get).toHaveBeenCalled();
    expect(res.data).toEqual([]);
  });

  it("should fetch products", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: { data: [] } });

    const res = await ProductService.getProducts();
    expect(apiClient.get).toHaveBeenCalled();
    expect(res.data).toEqual([]);
  });

  it("should fetch orders", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: { data: [] } });

    const res = await OrderService.getPaginatedOrders();
    expect(apiClient.get).toHaveBeenCalled();
    expect(res?.data).toEqual([]);
  });

  it("should upload image", async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: { url: "http://image.test/img.png" },
    });

    const formData = new FormData();
    const url = await ImageService.uploadImage(formData);

    expect(apiClient.post).toHaveBeenCalled();
    expect(url).toBe("http://image.test/img.png");
  });
});
