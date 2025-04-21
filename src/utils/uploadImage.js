import axios from "axios";

const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/upload/image`,
      formData,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    error.message =
      error.response?.data?.error || error.message || "Failed updating image ";
    throw error;
  }
};

export default uploadImage;
