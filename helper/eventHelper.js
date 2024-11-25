class EventHelper {
  constructor(organizationSettings) {
    this.organizationSettings = organizationSettings;
  }
  addServiceDetailsForEvent(
    service,
    course,
    courseType,
    courseTypeId,
    index,
    location
  ) {
    const serviceDetails = service.ele("SERVICE_DETAILS");
    serviceDetails.ele("TITLE").txt(course.title).up();

    // Service Dates
    const serviceDate = serviceDetails.ele("SERVICE_DATE");
    serviceDate
      .ele("START_DATE")
      .txt(course.date.start_date + "T00:00:00.000+02:00")
      .up();
    if (course.type == "Teilzeit") {
      serviceDate
        .ele("END_DATE")
        .txt(course.date.part_time_end_date + "T00:00:00.000+02:00")
        .up();
    } else {
      serviceDate
        .ele("END_DATE")
        .txt(course.date.end_date + "T00:00:00.000+02:00")
        .up();
    }

    this.addServiceModule(
      serviceDetails,
      course,
      courseType,
      courseTypeId,
      1,
      location
    );

    this.addServicePriceDetails(service, courseType, false);
  }

  addServiceModule(
    serviceDetails,
    course,
    courseType,
    courseTypeId,
    index,
    location
  ) {
    const serviceModule = serviceDetails.ele("SERVICE_MODULE");
    const education = serviceModule.ele("EDUCATION", {
      type: index === 0 ? "true" : "false",
    });
    education.ele("COURSE_ID").txt(courseTypeId).up();

    // Degree details
    const degree = education.ele("DEGREE", { type: courseType.degree_type1 });
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
    degree.ele("DEGREE_ENTITLED").txt(courseType.degree_entitled).up();
    if (location) {
      const mimeInfo = education.ele("MIME_INFO");
      mimeInfo
        .ele("MIME_ELEMENT")
        .ele("MIME_SOURCE")
        .txt(this.organizationSettings.mime_source)
        .up()
        .up();
    }

    // Certificate details
    const certificate = education.ele("CERTIFICATE");
    if (!location) {
      certificate
        .ele("CERTIFICATE_STATUS")
        .txt(this.organizationSettings.certificate_status)
        .up();
    } else {
      certificate.ele("CERTIFICATE_STATUS").txt(0).up();
    }

    certificate
      .ele("CERTIFIER_NUMBER")
      .txt(this.organizationSettings.certifier_number)
      .up();

    // Extended Info
    const extendedInfo = education.ele("EXTENDED_INFO");
    extendedInfo
      .ele("INSTITUTION", { type: this.organizationSettings.institution_type })
      .txt(this.organizationSettings.institution)
      .up();
    extendedInfo
      .ele("INSTRUCTION_FORM", { type: course.instruction_type1 })
      .txt(course.instruction_form)
      .up();
    extendedInfo
      .ele("INSTRUCTION_TIME", { type: course.type === "Teilzeit" ? 2 : 1 })
      .txt(course.type)
      .up();
    extendedInfo.ele("INHOUSE_SEMINAR").txt(false).up();
    extendedInfo.ele("EXTRA_OCCUPATIONAL").txt(false).up();
    extendedInfo.ele("PRACTICAL_PART").txt(false).up();

    if (location) {
      if (courseType.funding_type_id) {
        extendedInfo
          .ele("FUNDING_TYPES_FEDERAL", { type: courseType.funding_type_id })
          .txt(courseType.funding_type_name)
          .up();
      }
      extendedInfo.ele("DIGITAL_ACCESSIBILITY").txt(false).up();
      extendedInfo.ele("DIGITAL_ACCESSIBILITY_REMARKS").up();
    }
    extendedInfo
      .ele("EDUCATION_TYPE", { type: courseType.education_type2 })
      .txt(courseType.education_type1)
      .up();

    // Location details
    if (location) {
      const moduleEl = education.ele("MODULE_COURSE");
      const locationEl = moduleEl.ele("LOCATION");
      locationEl.ele("NAME").txt("Deutsche").up();
      locationEl.ele("NAME2").txt("E-Learning").up();
      locationEl.ele("NAME3").txt("Akademie").up();
      locationEl
        .ele("STREET")
        .txt(location.strasse + " " + location.hausnummer)
        .up();
      locationEl.ele("ZIP").txt(location.plz).up();
      locationEl.ele("CITY").txt(location.ort).up();
      locationEl.ele("PHONE").txt("+49.211.54257733").up();

      // Adding EMAILS and URL fields
      const emails = locationEl.ele("EMAILS");
      emails.ele("EMAIL").txt("info@dela-akademie.de").up();
      locationEl.ele("URL").txt("https://www.dela-akademie.de/").up();
      locationEl.ele("BARRIER_FREE_LOCATION").txt(false).up();

      // Additional module course details
      const formattedTime = this.formatInstructionRemarks(course);

      moduleEl.ele("INSTRUCTION_REMARKS").txt(formattedTime).up();
      moduleEl.ele("FLEXIBLE_START").txt(false).up();
    } else {
      // Add an empty LOCATION element
      const emptyLocationEl = education.ele("MODULE_COURSE").ele("LOCATION");
      emptyLocationEl.ele("NAME").txt(" ").up();
      emptyLocationEl.ele("ZIP").txt(" ").up();
      emptyLocationEl.ele("CITY").txt(" ").up();
    }

    return serviceModule;
  }

  formatInstructionRemarks(course) {
    if (!course.start_time || !course.end_time) {
      return "Invalid time range"; // Handle missing time gracefully
    }

    const [startHours, startMinutes] = course.start_time.split(":").map(Number);
    const [endHours, endMinutes] = course.end_time.split(":").map(Number);

    return `${String(startHours).padStart(2, "0")}:${String(
      startMinutes
    ).padStart(2, "0")} - ${String(endHours).padStart(2, "0")}:${String(
      endMinutes
    ).padStart(2, "0")} Uhr`;
  }

  // Helper method to add service price details
  addServicePriceDetails(service, courseType, isWithoutPrice) {
    const servicePriceDetails = service.ele("SERVICE_PRICE_DETAILS");
    const servicePrice = servicePriceDetails.ele("SERVICE_PRICE");
    if (isWithoutPrice) {
      servicePrice.ele("PRICE_AMOUNT").txt(1).up();
    } else {
      servicePrice.ele("PRICE_AMOUNT").txt(courseType.price_amount).up();
    }
    servicePrice.ele("PRICE_CURRENCY").txt(courseType.price_currency).up().up();
    servicePriceDetails
      .ele("REMARKS")
      .txt("")
      // .txt(courseType.subsidy_description || "")
      .up();
  }
}
export default EventHelper;
