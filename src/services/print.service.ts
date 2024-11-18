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

export const getPrintJobs = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found.");
  try {
    const response = await axios.get("http://127.0.0.1:8000/print_jobs/print/jobs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data; // Return the list of print jobs
  } catch (error) {
    console.error("Error fetching print jobs:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};