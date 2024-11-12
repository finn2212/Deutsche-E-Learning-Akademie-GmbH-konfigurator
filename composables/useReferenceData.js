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
    return data.map(entry => ({
      id: entry.id,
      text: entry[Object.keys(entry).find(key => key !== 'id')]
    }));
  };

  // Specific functions to fetch each reference table
  const fetchDegrees = () => fetchReferenceData('ref_degrees');
  const fetchAccreditationTypes = () => fetchReferenceData('ref_accreditation_types');
  const fetchOfferTypes = () => fetchReferenceData('ref_offer_types');
  const fetchDisabilities = () => fetchReferenceData('ref_disabilities');
  const fetchEducationTypes = () => fetchReferenceData('ref_education_types');
  const fetchDurationClasses = () => fetchReferenceData('ref_duration_classes');
  const fetchDeliveryForms = () => fetchReferenceData('ref_delivery_forms');
  const fetchFederalFundingTypes = () => fetchReferenceData('ref_federal_funding_types');
  const fetchPartnerCountries = () => fetchReferenceData('ref_partner_countries');
  const fetchTeachingTypes = () => fetchReferenceData('ref_teaching_types');
  const fetchMasterTypes = () => fetchReferenceData('ref_master_types');
  const fetchSchoolTypes = () => fetchReferenceData('ref_school_types');
  const fetchStudyForms = () => fetchReferenceData('ref_study_forms');
  const fetchStudyWithoutAbiturTypes = () => fetchReferenceData('ref_study_without_abitur_types');
  const fetchTeachingForms = () => fetchReferenceData('ref_teaching_forms');
  const fetchTeachingTimes = () => fetchReferenceData('ref_teaching_times');
  const fetchStructureTypes = () => fetchReferenceData('ref_structure_types');
  const fetchCertificationStatuses = () => fetchReferenceData('ref_certification_statuses');
  const fetchAffiliationTypes = () => fetchReferenceData('ref_affiliation_types');
  const fetchAdmissionModes = () => fetchReferenceData('ref_admission_modes');
  const fetchAdmissionSemesters = () => fetchReferenceData('ref_admission_semesters');

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
    fetchAdmissionSemesters
  };
}
