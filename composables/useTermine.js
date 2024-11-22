import { useNuxtApp } from "#app";

export function useTermine() {
  const { $supabase } = useNuxtApp();

  // Function to get one element by ID
  const getElementById = async (id) => {
    const { data, error } = await $supabase
      .from("all_termine") // Correct table name
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching element by ID:", error);
      return null;
    }

    return data;
  };

  // Function to get multiple elements by an array of IDs
  const getElementsByArray = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      console.warn("Invalid or empty ID array provided.");
      return [];
    }

    const { data, error } = await $supabase
      .from("all_termine") // Correct table name
      .select("*")
      .in("id", ids);

    if (error) {
      console.error("Error fetching elements by array of IDs:", error);
      return [];
    }

    return data;
  };

  // Function to save a single element
  const saveElement = async (element) => {
    const { error } = await $supabase
      .from("all_termine") // Correct table name
      .insert([element]);

    if (error) {
      console.error("Error saving element:", error);
      return false;
    }

    return true;
  };

  // Function to save multiple elements
  const saveElements = async (elements) => {
    if (!Array.isArray(elements) || elements.length === 0) {
      console.warn("Invalid or empty elements array provided.");
      return false;
    }

    for (const element of elements) {
      const success = await saveElement(element);
      if (!success) {
        console.error("Error saving one of the elements:", element);
        return false;
      }
    }

    return true;
  };

  return { getElementById, getElementsByArray, saveElement, saveElements };
}
