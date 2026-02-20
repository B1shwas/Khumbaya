import axios from "axios";

export const uploadImage = async (uri: string) => {
  const formData = new FormData();
  const fileName = uri.split("/").pop()!;
  const fileType = `image/${fileName.split(".").pop()}`;

  formData.append("file", { uri, name: fileName, type: fileType } as any);

  const response = await axios.post(
    "https://your-backend.com/api/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data; // e.g., { url: "https://..." }
};
