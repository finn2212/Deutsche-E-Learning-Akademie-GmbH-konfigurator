import { useNuxtApp } from "#app";

export function useDates() {
  const { $supabase } = useNuxtApp();

  // Function to fetch all dates
  const fetchAllDates = async () => {
    const { data, error } = await $supabase
      .from("dates") // The table name
      .select("*");

    if (error) {
      console.error("Error fetching dates:", error);
      return [];
    }

    return data;
  };

  // Function to delete a date by ID
  const deleteDateById = async (id) => {
    const { error } = await $supabase
      .from("dates") // The table name
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting date with ID ${id}:`, error);
      return false;
    }

    console.log(`Date with ID ${id} deleted successfully.`);
    return true;
  };

  // Function to save a new date entry
  const saveDate = async (dateEntry) => {
    const { data, error } = await $supabase
      .from("dates") // The table name
      .insert([dateEntry]); // Supabase expects an array for inserting

    if (error) {
      console.error("Error saving date entry:", error);
      return null;
    }

    console.log("Date entry saved successfully:", data);
    return data;
  };

  return {
    fetchAllDates,
    deleteDateById,
    saveDate,
  };
}
