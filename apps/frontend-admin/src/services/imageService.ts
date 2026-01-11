import apiClient from "./apiClient";

/**
 * Uploads an image file to the server and returns its public URL.
 * @param formData - FormData containing the image file
 */
export const uploadImage = async (formData: FormData): Promise<string> => {
  const res = await apiClient.post("/Blob/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
};

/**
 * Deletes an image from the server by filename.
 * @param fileName - Name of the file to delete
 */
export const deleteImage = async (fileName: string): Promise<void> => {
  await apiClient.delete(`/Blob/${fileName}`);
};