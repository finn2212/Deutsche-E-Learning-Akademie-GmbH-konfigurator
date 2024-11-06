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

  const fetchSelectedCoursesDetails = async (selectedCourseIds) => {

    try {
      // Step 1: Fetch selected courses by IDs
      const { data: courses, error: courseError } = await $supabase
        .from('all_termine')
        .select('id, title,type, course_type, date_id, location_id')
        .in('id', selectedCourseIds);
        
      if (courseError) throw courseError;
  
      // Collect unique date and location IDs to fetch details only once
      const dateIds = [...new Set(courses.map(course => course.date_id))];
      const locationIds = [...new Set(courses.map(course => course.location_id))];
  
      // Step 2: Fetch date details
      const { data: dates, error: dateError } = await $supabase
        .from('dates')
        .select('*')
        .in('id', dateIds);
  
      if (dateError) throw dateError;
  
      // Step 3: Fetch location details
      const { data: locations, error: locationError } = await $supabase
        .from('places')
        .select('*')
        .in('id', locationIds);
  
      if (locationError) throw locationError;
  
      // Step 4: Map dates and locations by their IDs for easy lookup
      const dateMap = Object.fromEntries(dates.map(date => [date.id, date]));
      const locationMap = Object.fromEntries(locations.map(location => [location.id, location]));
  
      // Step 5: Combine course data with related date and location details
      return groupCoursesByType(courses.map(course => ({
        ...course,
        date: dateMap[course.date_id],
        location: locationMap[course.location_id]
      })));
  
    } catch (error) {
      console.error('Error fetching course details:', error);
      return [];
    }
  }

  const groupCoursesByType = (courses) => {
    // Reduce the courses array into an object, grouped by course_type
    return courses.reduce((grouped, course) => {
      // Check if the course_type already exists in grouped object
      if (!grouped[course.course_type]) {
        grouped[course.course_type] = [];
      }
      // Add the course to the respective group
      grouped[course.course_type].push(course);
      return grouped;
    }, {});
  };

  return { 
    fetchCourseType, 
    returnCourseCombinations, 
    fetchLocations, 
    fetchStartTimes, 
    fetchDates, 
    calculateCombinations,
    fetchSelectedCoursesDetails
  };
}
