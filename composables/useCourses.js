import { useNuxtApp } from "#app";
export function useCourses() {
  const { $supabase } = useNuxtApp();

  // Fetch and decode the user role
  const deleteCourse = async (courseId) => {
    const { error } = await $supabase
      .from("all_termine")
      .delete()
      .eq("id", courseId);

    if (error) {
      console.error("Error deleting course:", error);
    } else {
      console.log(`Deleted course with ID: ${courseId}`);
      // Refresh the table data after deletion
    }
  };

  const deleteMultipleCourses = async (courseIds) => {
    // Convert Proxy to a normal array if needed
    const idsArray = Array.isArray(courseIds)
      ? courseIds
      : Array.from(courseIds);

    const { error } = await $supabase
      .from("all_termine")
      .delete()
      .in("id", idsArray); // Use .in() to match multiple IDs

    if (error) {
      console.error("Error deleting multiple courses:", error);
    } else {
      console.log(`Deleted courses with IDs: ${idsArray.join(", ")}`);
      // Refresh the table data after deletion
    }
  };

  return { deleteCourse, deleteMultipleCourses };
}
