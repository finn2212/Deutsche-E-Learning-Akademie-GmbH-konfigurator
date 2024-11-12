import { useCourseUtils } from '@/composables/useCourseUtils';
import { format, addYears } from "date-fns";

class IterationalHelper {
  constructor(organizationSettings) {
    this.organizationSettings = organizationSettings;
    const { fetchCourseType, returnCourseCombinations, fetchLocations, fetchStartTimes, fetchDates } = useCourseUtils();
    
    this.fetchCourseType = fetchCourseType;
    this.returnCourseCombinations = returnCourseCombinations;
    this.fetchLocations = fetchLocations;
    this.fetchStartTimes = fetchStartTimes;
    this.fetchDates = fetchDates;
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

  async generateServiceElements(newCatalog, selectedCourses) {
    let courseIndex = 0;

    for (const course of selectedCourses) {
      const courseType = await this.fetchCourseType(course.course_type);
      const combinations = await this.returnCourseCombinations(courseType, course);
      const titles = course.titles;

      titles.forEach((title, i) => {
        combinations.forEach((combination, combination_index) => {
            let service;
            if (combination_index === 0) {
              service = newCatalog.ele("SERVICE", { mode: "new" });
            } else {
              service = newCatalog.ele("SERVICE");
            }
            service
              .ele("PRODUCT_ID")
              .txt(courseIndex + i + "000" + combination_index)
              .up();
            service.ele("COURSE_TYPE").txt(courseType.course_type).up();
            service
              .ele("SUPPLIER_ID_REF", { type: "supplier_specific" })
              .txt(this.organizationSettings.supplier_id_ref)
              .up();
            const serviceDetails = service.ele("SERVICE_DETAILS");
            serviceDetails.ele("TITLE").txt(title).up();
            serviceDetails
              .ele("DESCRIPTION_LONG")
              .txt(courseType.description_long)
              .up();
            serviceDetails.ele("SUPPLIER_ALT_PID").txt("266026029").up();
            const contact = serviceDetails.ele("CONTACT");
            contact
              .ele("CONTACT_ROLE", {
                type: this.organizationSettings.contact_type,
              })
              .txt(this.organizationSettings.contact_role)
              .up();
            contact
              .ele("SALUTATION")
              .txt(this.organizationSettings.salutation)
              .up();
            contact
              .ele("FIRST_NAME")
              .txt(this.organizationSettings.first_name)
              .up();
            contact
              .ele("LAST_NAME")
              .txt(this.organizationSettings.last_name)
              .up();
            contact.ele("PHONE").txt(this.organizationSettings.phone).up();
            contact.ele("MOBILE").txt("").up();
            contact
              .ele("EMAILS")
              .ele("EMAIL")
              .txt(this.organizationSettings.email)
              .up()
              .up();
            contact.ele("URL").txt(this.organizationSettings.url).up();
            contact
              .ele("CONTACT_REMARKS")
              .txt(this.organizationSettings.contact_remarks)
              .up()
              .up();
            const serviceDate = serviceDetails.ele("SERVICE_DATE");
            serviceDate
              .ele("START_DATE")
              .txt(combination.date.start_date + "T00:00:00.000+02:00")
              .up();
            serviceDate
              .ele("END_DATE")
              .txt(combination.date.end_date + "T00:00:00.000+02:00")
              .up();
            const keywords = courseType.keywords_group
              .split(",")
              .map((keyword) => keyword.trim());
            keywords.forEach((keyword) => {
              serviceDetails.ele("KEYWORD").txt(keyword).up();
            });
            serviceDetails
              .ele("TARGET_GROUP")
              .ele("TARGET_GROUP_TEXT")
              .txt(courseType.target_group_text)
              .up()
              .up();
            serviceDetails
              .ele("TERMS_AND_CONDITIONS")
              .txt(courseType.terms_and_conditions)
              .up();
            const serviceModule = serviceDetails.ele("SERVICE_MODULE");
            const education = serviceModule.ele("EDUCATION", {
              type: combination_index === 0 ? "true" : "false",
            });
            education
              .ele("COURSE_ID")
              .txt(courseIndex + i + "0000")
              .up();
            const degree = education.ele("DEGREE", {
              type: courseType.degree_type1,
            });
            degree.ele("DEGREE_TITLE").txt(courseType.degree_title).up();
            degree
              .ele("DEGREE_EXAM", { type: courseType.degree_type2 })
              .ele("EXAMINER")
              .txt(courseType.examiner)
              .up()
              .up();
            degree
              .ele("DEGREE_ADD_QUALIFICATION")
              .txt(courseType.degree_add_qualification)
              .up();
            degree
              .ele("DEGREE_ENTITLED")
              .txt(courseType.degree_entitled)
              .up()
              .up();
            const mimeInfo = education.ele("MIME_INFO");
            mimeInfo
              .ele("MIME_ELEMENT")
              .ele("MIME_SOURCE")
              .txt(this.organizationSettings.mime_source)
              .up()
              .up();
            const certificate = education.ele("CERTIFICATE");
            certificate
              .ele("CERTIFICATE_STATUS")
              .txt(this.organizationSettings.certificate_status)
              .up();
            certificate
              .ele("CERTIFIER_NUMBER")
              .txt(this.organizationSettings.certifier_number)
              .up();
            certificate.ele("CERT_VALIDITY").up().up();
            const extendedInfo = education.ele("EXTENDED_INFO");
            extendedInfo
              .ele("INSTITUTION", {
                type: this.organizationSettings.institution_type,
              })
              .txt(this.organizationSettings.institution)
              .up();
            extendedInfo
              .ele("INSTRUCTION_FORM", {
                type: courseType.instruction_type1,
              })
              .txt(courseType.instruction_form)
              .up();
            extendedInfo
              .ele("INSTRUCTION_TIME", {
                type: combination.type === "Teilzeit" ? 2 : 1,
              })
              .txt(combination.type)
              .up();
            extendedInfo.ele("INHOUSE_SEMINAR").txt(false).up();
            extendedInfo.ele("EXTRA_OCCUPATIONAL").txt(false).up();
            extendedInfo.ele("PRACTICAL_PART").txt(false).up();
            extendedInfo
              .ele("EDUCATION_TYPE", { type: courseType.education_type2 })
              .txt(courseType.education_type2_name)
              .up();
            extendedInfo
              .ele("MEASURE_NUMBER")
              .txt(courseType.measure_number)
              .up()
              .up();
            const moduleCourse = education.ele("MODULE_COURSE");
            const location = moduleCourse.ele("LOCATION");
            if (courseType.instruction_type1 != "201") {
              location.ele("NAME").txt(this.organizationSettings.name).up();
              location.ele("NAME2").txt(this.organizationSettings.name2).up();
              location.ele("STREET").txt(combination.location.strasse).up();
              location.ele("ZIP").txt(combination.location.plz).up();
              location.ele("CITY").txt(combination.location.ort).up();
              location.ele("STATE").txt(combination.location.bundesland).up();
              location.ele("COUNTRY").txt(combination.location.land).up();
              location.ele("PHONE").txt(this.organizationSettings.phone).up();
              location.ele("FAX").txt(this.organizationSettings.fax).up();
              location.ele("EMAILS").ele("EMAIL").txt("").up().up();
              location.ele("URL").txt("").up();
            } else {
              location.ele("NAME").txt("").up();
              location.ele("ZIP").txt("").up();
              location.ele("CITY").txt("").up();
              location.ele("ID_DB").txt("").up();
            }
            moduleCourse
              .ele("DURATION", { type: courseType.duration_type })
              .up();
            moduleCourse
              .ele("INSTRUCTION_REMARKS")
              .txt(courseType.instruction_remarks)
              .up();
            moduleCourse
              .ele("FLEXIBLE_START")
              .txt(courseType.flexible_start)
              .up();
            moduleCourse
              .ele("EXTENDED_INFO")
              .ele("SEGMENT_TYPE", { type: courseType.segment_type2 })
              .up()
              .up()
              .up();
            const endDateWithAddedTime = this.addHoursToTime(
              combination.startTime.time,
              8
            );
            const today = new Date();
            const nextYear = addYears(today, 1);
            const formattedStartDate = format(today, "yyyy-MM-dd'+02:00'");
            const formattedEndDate = format(nextYear, "yyyy-MM-dd'+02:00'");
            service
              .ele("SERVICE_CLASSIFICATION")
              .ele("REFERENCE_CLASSIFICATION_SYSTEM_NAME")
              .txt("Kurssystematik")
              .up()
              .ele("FEATURE")
              .ele("FNAME")
              .txt(courseType.fname)
              .up()
              .ele("FVALUE")
              .txt(courseType.fvalue)
              .up()
              .up()
              .up();
            service
              .ele("SERVICE_PRICE_DETAILS")
              .ele("SERVICE_PRICE")
              .ele("PRICE_AMOUNT")
              .txt(courseType.price_amount)
              .up()
              .ele("PRICE_CURRENCY")
              .txt(courseType.price_currency)
              .up()
              .up()
              .ele("REMARKS")
              .txt(courseType.subsidy_description)
              .up()
              .up();
            service
              .ele("MIME_INFO")
              .ele("MIME_ELEMENT")
              .ele("MIME_SOURCE")
              .txt(this.organizationSettings.mime_source)
              .up()
              .up()
              .up();
          });
      });
      courseIndex++;
    }
  }
}
export default IterationalHelper;
