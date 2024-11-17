import axios from "axios";

export const printCustomization = async (customizationId: number) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found.");

  const response = await axios.post(
    `http://127.0.0.1:8000/print_jobs/print`,
    { customization_id: customizationId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
