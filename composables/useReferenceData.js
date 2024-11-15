import { useNuxtApp } from "#app";

export function useReferenceData() {
  const { $supabase } = useNuxtApp();

  // General function to fetch reference data from a specified table
  const fetchReferenceData = async (table) => {
    const { data, error } = await $supabase.from(table).select("*");

    if (error) {
      console.error(`Error fetching data from ${table}:`, error);
      return [];
    }

    // Return as a list of { id, text } objects
    return data.map((entry) => ({
      id: entry.id,
      text: entry[Object.keys(entry).find((key) => key !== "id")],
    }));
  };

  // Specific functions to fetch each reference table
  const fetchDegrees = () => fetchReferenceData("ref_degrees");
  const fetchAccreditationTypes = () =>
    fetchReferenceData("ref_accreditation_types");
  const fetchOfferTypes = () => fetchReferenceData("ref_offer_types");
  const fetchDisabilities = () => fetchReferenceData("ref_disabilities");
  const fetchEducationTypes = () => fetchReferenceData("ref_education_types");
  const fetchDurationClasses = () => fetchReferenceData("ref_duration_classes");
  const fetchDeliveryForms = () => fetchReferenceData("ref_delivery_forms");
  const fetchFederalFundingTypes = () =>
    fetchReferenceData("ref_federal_funding_types");
  const fetchPartnerCountries = () =>
    fetchReferenceData("ref_partner_countries");
  const fetchTeachingTypes = () => fetchReferenceData("ref_teaching_types");
  const fetchMasterTypes = () => fetchReferenceData("ref_master_types");
  const fetchSchoolTypes = () => fetchReferenceData("ref_school_types");
  const fetchStudyForms = () => fetchReferenceData("ref_study_forms");
  const fetchStudyWithoutAbiturTypes = () =>
    fetchReferenceData("ref_study_without_abitur_types");
  const fetchTeachingForms = () => fetchReferenceData("ref_teaching_forms");
  const fetchTeachingTimes = () => fetchReferenceData("ref_teaching_times");
  const fetchStructureTypes = () => fetchReferenceData("ref_structure_types");
  const fetchCertificationStatuses = () =>
    fetchReferenceData("ref_certification_statuses");
  const fetchAffiliationTypes = () =>
    fetchReferenceData("ref_affiliation_types");
  const fetchAdmissionModes = () => fetchReferenceData("ref_admission_modes");
  const fetchAdmissionSemesters = () =>
    fetchReferenceData("ref_admission_semesters");

  const fetchRefGroups = async (query, courseType) => {
    // Define allowed prefixes based on the course type
    const allowedPrefixes = courseType === 5 ? ["D", "C"] : null;

    // Fetch data from Supabase
    const { data, error } = await $supabase
      .from("ref_classification_groups") // Ensure this is the correct table name in your Supabase setup
      .select("ref_group_id, ref_group_description, ref_group_name")
      .or(
        `ref_group_description.ilike.%${query}%,ref_group_name.ilike.%${query}%`
      ) // Search by both description and name
      .limit(99); // Limit results to top 200 suggestions

    if (error) {
      console.error("Error fetching ref groups:", error);
      return [];
    }

    // Filter results by allowed prefixes if necessary
    const filteredData = allowedPrefixes
      ? data.filter((entry) => {
          const prefix = entry.ref_group_name.split(" ")[0]; // Extract the prefix from the description
          
          return allowedPrefixes.includes(prefix);
        })
      : data; // If no filtering is required, return all results
      
    // Return matched entries with their IDs, names, and descriptions
    return filteredData.map((entry) => ({
      id: entry.ref_group_id,
      ref_group_description: entry.ref_group_description,
      ref_group_name: entry.ref_group_name,
    }));
  };

  // Function to fetch a single group by ID
  const fetchRefGroupById = async (id) => {
    const { data, error } = await $supabase
      .from("ref_classification_groups") // Ensure this is the correct table name
      .select("ref_group_id, ref_group_description, ref_group_name") // Specify the fields to fetch
      .eq("ref_group_id", id) // Match by ID
      .single(); // Expect a single result

    if (error) {
      console.error(`Error fetching ref group by ID (${id}):`, error);
      return null;
    }

    // Return the fetched group
    return {
      id: data.ref_group_id,
      ref_group_description: data.ref_group_description,
      ref_group_name: data.ref_group_name,
    };
  };

  return {
    fetchDegrees,
    fetchAccreditationTypes,
    fetchOfferTypes,
    fetchDisabilities,
    fetchEducationTypes,
    fetchDurationClasses,
    fetchDeliveryForms,
    fetchFederalFundingTypes,
    fetchPartnerCountries,
    fetchTeachingTypes,
    fetchMasterTypes,
    fetchSchoolTypes,
    fetchStudyForms,
    fetchStudyWithoutAbiturTypes,
    fetchTeachingForms,
    fetchTeachingTimes,
    fetchStructureTypes,
    fetchCertificationStatuses,
    fetchAffiliationTypes,
    fetchAdmissionModes,
    fetchAdmissionSemesters,
    fetchRefGroups,
    fetchRefGroupById,
  };
}
