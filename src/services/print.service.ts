import axios from "axios";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const printCustomization = async (customizationId: number) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found.");

  const response = await axios.post(
    `${REACT_APP_API_URL}/print_jobs/print`,
    { customization_id: customizationId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const getPrintJobs = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found.");
  try {
    const response = await axios.get(`${REACT_APP_API_URL}/print_jobs/print/jobs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching print jobs:", error);
    throw error; 
  }
};