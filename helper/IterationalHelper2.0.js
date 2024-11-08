import { useCourseUtils } from '@/composables/useCourseUtils';
import { format, addYears } from "date-fns";

class IterationalHelper {
  constructor(organizationSettings) {
    this.organizationSettings = organizationSettings;
    const { fetchCourseType, returnCourseCombinations, fetchLocations, fetchStartTimes, fetchDates, fetchSelectedCoursesDetails } = useCourseUtils();
    
    this.fetchCourseType = fetchCourseType;
    this.returnCourseCombinations = returnCourseCombinations;
    this.fetchLocations = fetchLocations;
    this.fetchStartTimes = fetchStartTimes;
    this.fetchDates = fetchDates;
    this.fetchSelectedCoursesDetails = fetchSelectedCoursesDetails;
  }

  // Method to add hours to a given time
  addHoursToTime(time, hoursToAdd) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours + hoursToAdd, minutes, seconds);
    const newHours = String(date.getHours()).padStart(2, "0");
    const newMinutes = String(date.getMinutes()).padStart(2, "0");
    const newSeconds = String(date.getSeconds()).padStart(2, "0");
    return `${newHours}:${newMinutes}:${newSeconds}`;
  }

  // Generate service elements and structure them according to XML requirements
  async generateServiceElements(newCatalog, selectedCourses) {
    const groupedCourses = await this.fetchSelectedCoursesDetails(selectedCourses);

    for (const [courseTypeId, courses] of Object.entries(groupedCourses)) {
      const courseType = await this.fetchCourseType(courseTypeId);

      courses.forEach((course, index) => {
        let service;
        if (index === 0) {
          service = newCatalog.ele('SERVICE', { mode: 'new' });
          service.ele('PRODUCT_ID').txt(courseTypeId).up();
        } else {
          service = newCatalog.ele('SERVICE');
          service.ele('PRODUCT_ID').txt(course.id).up();
        }

        service.ele('COURSE_TYPE').txt(courseType.course_type).up();
        this.addServiceDetails(service, course, courseType, courseTypeId, index);
      });
    }
  }

  // Helper method to add Service Details section
  addServiceDetails(service, course, courseType, courseTypeId, index) {
    const serviceDetails = service.ele('SERVICE_DETAILS');
    serviceDetails.ele('TITLE').txt(course.title).up();
    serviceDetails.ele('DESCRIPTION_LONG').txt(courseType.description_long).up();
    serviceDetails.ele('SUPPLIER_ALT_PID').txt(courseTypeId).up();

    // Contact information
    const contact = serviceDetails.ele('CONTACT');
    this.addContactInfo(contact);

    // Service Dates
    const serviceDate = serviceDetails.ele('SERVICE_DATE');
    serviceDate.ele('START_DATE').txt(course.date.start_date + 'T00:00:00.000+02:00').up();
    serviceDate.ele('END_DATE').txt(course.date.end_date + 'T00:00:00.000+02:00').up();

    // Keywords
    this.addKeywords(serviceDetails, courseType.keywords_group);

    // Target Group
    serviceDetails.ele('TARGET_GROUP').ele('TARGET_GROUP_TEXT').txt(courseType.target_group_text).up().up();

    // Terms and Conditions
    serviceDetails.ele('TERMS_AND_CONDITIONS').txt(courseType.terms_and_conditions || '').up();

    // Service Module
    this.addServiceModule(serviceDetails, course, courseType, courseTypeId, index);

    // Service Classification
    this.addServiceClassification(service, courseType);

    // Service Price Details
    this.addServicePriceDetails(service, courseType);

    // MIME Info
    const mimeInfo = service.ele('MIME_INFO');
    mimeInfo.ele('MIME_ELEMENT').ele('MIME_SOURCE').txt(this.organizationSettings.mime_source).up().up();
  }

  // Helper method to add contact information
  addContactInfo(contact) {
    contact.ele('CONTACT_ROLE', { type: this.organizationSettings.contact_type })
      .txt(this.organizationSettings.contact_role)
      .up();
    contact.ele('SALUTATION').txt(this.organizationSettings.salutation).up();
    contact.ele('FIRST_NAME').txt(this.organizationSettings.first_name).up();
    contact.ele('LAST_NAME').txt(this.organizationSettings.last_name).up();
    contact.ele('PHONE').txt(this.organizationSettings.phone).up();
    contact.ele('MOBILE').txt('').up();
    contact.ele('EMAILS').ele('EMAIL').txt(this.organizationSettings.email).up().up();
    contact.ele('URL').txt(this.organizationSettings.url).up();
    contact.ele('CONTACT_REMARKS').txt(this.organizationSettings.contact_remarks).up().up();
  }

  // Helper method to add keywords
  addKeywords(serviceDetails, keywordsGroup) {
    const keywords = keywordsGroup.split(',').map((keyword) => keyword.trim());
    keywords.forEach((keyword) => {
      serviceDetails.ele('KEYWORD').txt(keyword).up();
    });
  }

  // Helper method to add service module details
  addServiceModule(serviceDetails, course, courseType, courseTypeId, index) {
    const serviceModule = serviceDetails.ele('SERVICE_MODULE');
    const education = serviceModule.ele('EDUCATION', { type: index === 0 ? 'true' : 'false' });
    education.ele('COURSE_ID').txt(courseTypeId).up();

    // Degree details
    const degree = education.ele('DEGREE', { type: courseType.degree_type1 });
    degree.ele('DEGREE_TITLE').txt(courseType.degree_title).up();
    degree.ele('DEGREE_EXAM', { type: courseType.degree_type2 }).ele('EXAMINER').txt(courseType.examiner).up().up();
    degree.ele('DEGREE_ADD_QUALIFICATION').txt(courseType.degree_add_qualification).up();
    degree.ele('DEGREE_ENTITLED').txt(courseType.degree_entitled).up();

    // Certificate details
    const certificate = education.ele('CERTIFICATE');
    certificate.ele('CERTIFICATE_STATUS').txt(this.organizationSettings.certificate_status).up();
    certificate.ele('CERTIFIER_NUMBER').txt(this.organizationSettings.certifier_number).up();
    certificate.ele('CERT_VALIDITY').up().up();

    // Extended Info
    const extendedInfo = education.ele('EXTENDED_INFO');
    extendedInfo.ele('INSTITUTION', { type: this.organizationSettings.institution_type }).txt(this.organizationSettings.institution).up();
    extendedInfo.ele('INSTRUCTION_FORM', { type: courseType.instruction_type1 }).txt(courseType.instruction_form_name).up();
    extendedInfo.ele('INSTRUCTION_TIME', { type: course.type === 'Teilzeit' ? 2 : 1 }).txt(course.type).up();
    extendedInfo.ele('INHOUSE_SEMINAR').txt(false).up();
    extendedInfo.ele('EXTRA_OCCUPATIONAL').txt(false).up();
    extendedInfo.ele('PRACTICAL_PART').txt(false).up();
    extendedInfo.ele('EDUCATION_TYPE', { type: courseType.education_type2 }).txt(courseType.education_type1).up();
  }

  // Helper method to add service classification
  addServiceClassification(service, courseType) {
    const serviceClassification = service.ele('SERVICE_CLASSIFICATION');
    serviceClassification.ele('REFERENCE_CLASSIFICATION_SYSTEM_NAME').txt('Kurssystematik').up();
    serviceClassification.ele('FEATURE').ele('FNAME').txt(courseType.fname).up().ele('FVALUE').txt(courseType.fvalue).up().up();
  }

  // Helper method to add service price details
  addServicePriceDetails(service, courseType) {
    const servicePriceDetails = service.ele('SERVICE_PRICE_DETAILS');
    const servicePrice = servicePriceDetails.ele('SERVICE_PRICE');
    servicePrice.ele('PRICE_AMOUNT').txt(courseType.price_amount).up();
    servicePrice.ele('PRICE_CURRENCY').txt(courseType.price_currency).up().up();
    servicePriceDetails.ele('REMARKS').txt(courseType.subsidy_description || '').up();
  }
}
export default IterationalHelper;
