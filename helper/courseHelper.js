class courseHelper {
    constructor(organizationSettings) {
        this.organizationSettings = organizationSettings;
      }
  addServiceDetailsForCourse(service, course, courseType, courseTypeId, index) {
    const serviceDetails = service.ele("SERVICE_DETAILS");
    serviceDetails.ele("TITLE").txt(course.title).up();
    serviceDetails
      .ele("DESCRIPTION_LONG")
      .txt(courseType.description_long)
      .up();
    serviceDetails.ele("SUPPLIER_ALT_PID").txt(courseTypeId).up();

    // Contact information
    const contact = serviceDetails.ele("CONTACT");
    this.addContactInfo(contact);

    // Service Dates - Calculate past dates
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setMonth(startDate.getMonth() - 2); // 2 months in the past

    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() - 1); // 1 month in the past

    const formattedStartDate =
      startDate.toISOString().split("T")[0] + "T00:00:00.000+02:00";
    const formattedEndDate =
      endDate.toISOString().split("T")[0] + "T00:00:00.000+02:00";

    const serviceDate = serviceDetails.ele("SERVICE_DATE");
    serviceDate.ele("START_DATE").txt(formattedStartDate).up();
    serviceDate.ele("END_DATE").txt(formattedEndDate).up();
    // Keywords
    this.addKeywords(serviceDetails, courseType.keywords_group);

    // Target Group
    serviceDetails
      .ele("TARGET_GROUP")
      .ele("TARGET_GROUP_TEXT")
      .txt(courseType.target_group_text)
      .up()
      .up();

    // Terms and Conditions
    serviceDetails
      .ele("TERMS_AND_CONDITIONS")
      .txt(courseType.terms_and_conditions || "")
      .up();

    // Service Module
    this.addServiceModule(
      serviceDetails,
      course,
      courseType,
      courseTypeId,
      index
    );

    // Service Classification
    this.addServiceClassification(service, courseType);

    // Service Price Details
    this.addServicePriceDetails(service, courseType, true);

    const mimeInfo = service.ele("MIME_INFO");
    mimeInfo
      .ele("MIME_ELEMENT")
      .ele("MIME_SOURCE")
      .txt(this.organizationSettings.mime_source)
      .up()
      .up();
  }

  addContactInfo(contact) {
    contact
      .ele("CONTACT_ROLE", { type: this.organizationSettings.contact_type })
      .txt(this.organizationSettings.contact_role)
      .up();
    contact.ele("SALUTATION").txt(this.organizationSettings.salutation).up();
    contact.ele("FIRST_NAME").txt(this.organizationSettings.first_name).up();
    contact.ele("LAST_NAME").txt(this.organizationSettings.last_name).up();
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
  }

  addServiceModule(
    serviceDetails,
    course,
    courseType,
    courseTypeId,
    index,
    location,
    startTime
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
      const formattedTime = this.formatInstructionRemarks(startTime);

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

  // Helper method to add service classification
  addServiceClassification(service, courseType) {
    const serviceClassification = service.ele("SERVICE_CLASSIFICATION");
    serviceClassification
      .ele("REFERENCE_CLASSIFICATION_SYSTEM_NAME")
      .txt("Kurssystematik")
      .up();
    serviceClassification
      .ele("FEATURE")
      .ele("FNAME")
      .txt(courseType.fname)
      .up()
      .ele("FVALUE")
      .txt(courseType.fvalue)
      .up()
      .up();
  }

  addKeywords(serviceDetails, keywordsGroup) {
    const keywords = keywordsGroup.split(",").map((keyword) => keyword.trim());
    keywords.forEach((keyword) => {
      serviceDetails.ele("KEYWORD").txt(keyword).up();
    });
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
export default courseHelper;
