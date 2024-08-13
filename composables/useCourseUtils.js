import { useNuxtApp } from "#app";

export function useCourseUtils() {
  const { $supabase } = useNuxtApp(); // Correctly get the Supabase client with the $ prefix

  const fetchLocations = async (locationIds) => {
    const { data, error } = await $supabase
      .from("places")
      .select("*")
      .in("id", locationIds);
    if (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
    return data;
  };

  const fetchStartTimes = async (startTimeIds) => {
    const { data, error } = await $supabase
      .from("start_times")
      .select("*")
      .in("id", startTimeIds);
    if (error) {
      console.error("Error fetching start times:", error);
      return [];
    }
    return data;
  };

  const fetchDates = async (dateIds) => {
    const { data, error } = await $supabase
      .from("dates")
      .select("*")
      .in("id", dateIds);
    if (error) {
      console.error("Error fetching dates:", error);
      return [];
    }
    return data;
  };

  const fetchCourseType = async (courseTypeId) => {
    const { data, error } = await $supabase
      .from("course_types")
      .select("*")
      .eq("id", courseTypeId.toString())
      .single();

    if (error) {
      console.error("Error fetching course type:", error);
      return null;
    }

    return data;
  };

  const returnCourseCombinations = async (courseType, course) => {
    const locations = await fetchLocations(course.location_ids);
    const startTimes = await fetchStartTimes(course.start_time_ids);
    const dates = await fetchDates(course.dates_ids);
    const titles = course.titles;
    const types = course.types;

    const combinations = [];
    if (courseType.instruction_type1 === "201") {
      for (const startTime of startTimes) {
        for (const date of dates) {
          for (const title of titles) {
            for (const type of types) {
              const combination = { startTime, date, title, type };
              combinations.push(combination);
            }
          }
        }
      }
    } else {
      for (const location of locations) {
        for (const startTime of startTimes) {
          for (const date of dates) {
            for (const type of types) {
              const combination = { location, startTime, date, type };
              combinations.push(combination);
            }
          }
        }
      }
    }
    return combinations;
  };

  const calculateCombinations = async (selectedCourses) => {
    let combinationCount = 0;
  
    for (const course of selectedCourses) {
      const courseType = await fetchCourseType(course.course_type);
      const combinations = await returnCourseCombinations(courseType, course);
      const titles = course.titles;
      titles.forEach(() => {
        combinations.forEach(() => {
          combinationCount++;
        });
      });
    }
  
    return combinationCount;
  };

  return { 
    fetchCourseType, 
    returnCourseCombinations, 
    fetchLocations, 
    fetchStartTimes, 
    fetchDates, 
    calculateCombinations 
  };
}
