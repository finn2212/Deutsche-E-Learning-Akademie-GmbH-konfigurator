import { useCourseUtils } from "@/composables/useCourseUtils";
import CourseHelper from "./courseHelper";
import EventHelper from "./eventHelper";

class ServiceHelper {
  constructor(organizationSettings) {
    this.organizationSettings = organizationSettings;
    const {
      fetchCourseType,
      returnCourseCombinations,
      fetchLocations,
      fetchStartTimeById,
      fetchDates,
      fetchSelectedCoursesDetails,
      fetchLocationById,
    } = useCourseUtils();

    this.fetchCourseType = fetchCourseType;
    this.returnCourseCombinations = returnCourseCombinations;
    this.fetchLocations = fetchLocations;
    this.fetchStartTimeById = fetchStartTimeById;
    this.fetchDates = fetchDates;
    this.fetchSelectedCoursesDetails = fetchSelectedCoursesDetails;
    this.fetchLocationById = fetchLocationById;
  }

  // Generate service elements and structure them according to XML requirements
  async generateServiceElements(newCatalog, selectedCourses) {
    const groupedCourses = await this.fetchSelectedCoursesDetails(
      selectedCourses
    );
    for (const [courseTypeId, courses] of Object.entries(groupedCourses)) {
      const courseType = await this.fetchCourseType(courseTypeId);
      const service = newCatalog.ele("SERVICE", { mode: "new" });
      let course_id = "";
      if (courseType.manual_id) {
        course_id = courseType.manual_id;
      } else {
        course_id = courseTypeId;
      }
      service.ele("PRODUCT_ID").txt(course_id).up();
      service.ele("COURSE_TYPE").txt(courseType.course_type).up();
      const courseHelper = new CourseHelper(this.organizationSettings)
      const eventHelper = new EventHelper(this.organizationSettings)
      courseHelper.addServiceDetailsForCourse(
        service,
        courses[0],
        courseType,
        course_id,
        0
      );

      for (const [index, course] of courses.entries()) {
        const location = await this.fetchLocationById(course.location_id);
        const startTime = await this.fetchStartTimeById(course.start_time_id);
        const serviceEvent = newCatalog.ele("SERVICE");
        serviceEvent.ele("PRODUCT_ID").txt(course.id).up();

        serviceEvent.ele("COURSE_TYPE").txt(courseType.course_type).up();
        eventHelper.addServiceDetailsForEvent(
          serviceEvent,
          course,
          courseType,
          course_id,
          index,
          location,
          startTime
        );
      }
    }
  }
}
export default ServiceHelper;
