import { create } from "xmlbuilder2";
import { useNuxtApp } from "#app";
import { format, addYears } from 'date-fns';

class XmlHelper {
  constructor(organizationSettings, courseType, course) {
    this.organizationSettings = organizationSettings;
    this.courseType = courseType;
    this.course = course;
    const { $supabase } = useNuxtApp();
    this.supabase = $supabase;
  }

  addHoursToTime(time, hoursToAdd) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours + hoursToAdd, minutes, seconds);
    const newHours = String(date.getHours()).padStart(2, "0");
    const newMinutes = String(date.getMinutes()).padStart(2, "0");
    const newSeconds = String(date.getSeconds()).padStart(2, "0");
    return `${newHours}:${newMinutes}:${newSeconds}`;
  }

  async fetchLocations(locationIds) {
    const { data, error } = await this.supabase
      .from("places")
      .select("*")
      .in("id", locationIds);
    if (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
    return data;
  }

  async fetchStartTimes(startTimeIds) {
    const { data, error } = await this.supabase
      .from("start_times")
      .select("*")
      .in("id", startTimeIds);
    if (error) {
      console.error("Error fetching start times:", error);
      return [];
    }
    return data;
  }

  async fetchDates(dateIds) {
    const { data, error } = await this.supabase
      .from("dates")
      .select("*")
      .in("id", dateIds);
    if (error) {
      console.error("Error fetching dates:", error);
      return [];
    }
    return data;
  }

  async calculateCombinations() {
    console.log(this.courseType.instruction_type1);
    const locations = await this.fetchLocations(this.course.location_ids);
    const startTimes = await this.fetchStartTimes(this.course.start_time_ids);
    const dates = await this.fetchDates(this.course.dates_ids);
    const titles = this.course.titles;
    const types = this.course.types;

    const combinations = [];
    if (this.courseType.instruction_type1 === "201") {
      console.log("whichout locations");
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
        console.log("including locations");
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

    console.log(`Total combinations: ${combinations.length}`);
    return combinations;
  }

  async generateXml() {
    const combinations = await this.calculateCombinations();

    // Create the XML document
    const root = create({
      version: "1.0",
      encoding: "utf-8",
      standalone: "yes",
    })
      .ele("OPENQCAT", {
        version: "1.1",
        "xsi:noNamespaceSchemaLocation": "openQ-cat.V1.1.xsd",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      })
      .ele("HEADER")
      .ele("GENERATOR_INFO")
      .txt("Export OpenQ 3.45.0")
      .up()
      .ele("CATALOG")
      .ele("LANGUAGE")
      .txt("deu")
      .up()
      .ele("CATALOG_ID")
      .txt("90037-1719216329353")
      .up()
      .ele("CATALOG_VERSION")
      .txt("Vers_KURSNET")
      .up()
      .ele("CATALOG_NAME")
      .txt("KURSNET-Export")
      .up()
      .ele("GENERATION_DATE")
      .txt("2024-07-09T09:56:09.912+02:00")
      .up()
      .up()
      .ele("DOCUMENT_CREATOR")
      .ele("FIRST_NAME")
      .txt("Exporter")
      .up()
      .ele("LAST_NAME")
      .txt("openQ-CAT")
      .up()
      .ele("PHONE")
      .txt("+49.911.179")
      .up()
      // .ele("ID_DB")
      // .txt("nr:9354")
      // .up()
      .ele("ADDRESS")
      .ele("NAME")
      .txt("IT-Systemhaus")
      .up()
      .ele("STREET")
      .txt("Regensburgerstr. 104")
      .up()
      .ele("ZIP")
      .txt("90478")
      .up()
      .ele("CITY")
      .txt("Nürnberg")
      .up()
      .ele("COUNTRY")
      .txt("DE")
      .up()
      .ele("URL")
      .txt("http://www.kursnet-online.arbeitsagentur.de")
      .up()
      // .ele("ID_DB")
      // .txt("adr:160")
      // .up()
      .up()
      .ele("CONTACT_REMARKS")
      .txt("Eugen Riske")
      .up()
      .up()
      .ele("RECIPIENT")
      .ele("RECIPIENT_ID")
      .txt("BA")
      .up()
      .ele("RECIPIENT_NAME")
      .txt("Informationssystem KURSNET")
      .up()
      .ele("ADDRESS")
      .ele("NAME")
      .txt("IT-Systemhaus")
      .up()
      .ele("STREET")
      .txt("Regensburgerstr. 104")
      .up()
      .ele("ZIP")
      .txt("90478")
      .up()
      .ele("CITY")
      .txt("Nürnberg")
      .up()
      .ele("COUNTRY")
      .txt("DE")
      .up()
      .ele("URL")
      .txt("http://www.kursnet-online.arbeitsagentur.de")
      .up()
      .up()
      .up()
      .ele("SUPPLIER")
      .ele("SUPPLIER_ID", { type: "supplier_specific" })
      .txt(this.organizationSettings.supplier_id_ref)
      .up()
      .ele("SUPPLIER_NAME")
      .txt(this.organizationSettings.name)
      .up()
      .ele("ADDRESS")
      .ele("NAME")
      .txt(this.organizationSettings.name2)
      .up()
      .ele("STREET")
      .txt("Fürstenwall 178")
      .up()
      .ele("ZIP")
      .txt("40215")
      .up()
      .ele("CITY")
      .txt("Düsseldorf")
      .up()
      .ele("STATE")
      .txt("Nordrhein-Westfalen")
      .up()
      .ele("COUNTRY")
      .txt("deutschland")
      .up()
      .ele("PHONE")
      .txt("+49.211.54257739")
      .up()
      .ele("MOBILE")
      .txt("")
      .up()
      .ele("FAX")
      .txt("")
      .up()
      .ele("EMAILS")
      .ele("EMAIL")
      .txt("info@dela-akademie.de")
      .up()
      .up()
      .ele("URL")
      .txt("https://www.dela-akademie.de")
      .up()
      .up()
      .ele("CONTACT")
      .ele("CONTACT_ROLE", { type: "5" })
      .txt(this.organizationSettings.contact_role)
      .up()
      .ele("SALUTATION")
      .txt(this.organizationSettings.salutation)
      .up()
      .ele("FIRST_NAME")
      .txt(this.organizationSettings.first_name)
      .up()
      .ele("LAST_NAME")
      .txt(this.organizationSettings.last_name)
      .up()
      .ele("PHONE")
      .txt("+49.211.54257739")
      .up()
      .ele("MOBILE")
      .txt("")
      .up()
      .ele("FAX")
      .txt("")
      .up()
      .ele("EMAILS")
      .ele("EMAIL")
      .txt("info@dela-akademie.de")
      .up()
      .up()
      .ele("URL")
      .txt("https://www.dela-akademie.de")
      .up()
      // .ele("ID_DB")
      // .txt("QLPERS.33698")
      // .up()
      .ele("CONTACT_REMARKS")
      .txt("")
      .up()
      .up()
      .ele("KEYWORD")
      .txt("DELA")
      .up()
      .ele("KEYWORD")
      .txt("Bildung")
      .up()
      .ele("KEYWORD")
      .txt("Rechnungswesen")
      .up()
      .ele("KEYWORD")
      .txt("Deutsche E-Learning Akademie")
      .up()
      .ele("KEYWORD")
      .txt("Bildungsakademie")
      .up()
      .ele("KEYWORD")
      .txt("Perspektive")
      .up()
      .ele("KEYWORD")
      .txt("Buchhaltung")
      .up()
      .ele("EXTENDED_INFO", { input_type: "0" })
      .ele("ORGANIZATIONAL_FORM", { type: "2" })
      .txt("Private Bildungseinrichtung")
      .up()
      .up()
      .up()
      .up();

    const newCatalog = root.ele("NEW_CATALOG", { FULLCATALOG: "true" });
    const titels = this.course.titles;

    titels.forEach((titel, i) => {
      combinations.forEach((combination, combination_index) => {
      let service;
      if (combination_index === 0) {
        service = newCatalog.ele("SERVICE", { mode: "new" });
      } else {
        service = newCatalog.ele("SERVICE");
      }
      service
        .ele("PRODUCT_ID")
        .txt(i + "000" + combination_index)
        .up();
      service.ele("COURSE_TYPE").txt(this.courseType.course_type).up();
      service
        .ele("SUPPLIER_ID_REF", { type: "supplier_specific" })
        .txt(this.organizationSettings.supplier_id_ref)
        .up();
      const serviceDetails = service.ele("SERVICE_DETAILS");
      serviceDetails.ele("TITLE").txt(titel).up();
      serviceDetails
        .ele("DESCRIPTION_LONG")
        .txt(this.courseType.description_long)
        .up();
      serviceDetails.ele("SUPPLIER_ALT_PID").txt("266026029").up();
      const contact = serviceDetails.ele("CONTACT");
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
      const serviceDate = serviceDetails.ele("SERVICE_DATE");
      // serviceDate.ele("START_DATE").txt(combination.date.start_date).up();
      // serviceDate.ele("END_DATE").txt(combination.date.end_date).up();
      serviceDate
        .ele("START_DATE")
        .txt(combination.date.start_date + "T00:00:00.000+02:00")
        .up();
      serviceDate
        .ele("END_DATE")
        .txt(combination.date.end_date + "T00:00:00.000+02:00")
        .up();
      //   serviceDate
      //     .ele("DATE_REMARKS")
      //     .txt(this.courseType.date_remarks || "Einzelne Präsenztage vor Ort")
      //     .up()
      //     .up();
      const keywords = this.courseType.keywords_group
        .split(",")
        .map((keyword) => keyword.trim());
      keywords.forEach((keyword) => {
        serviceDetails.ele("KEYWORD").txt(keyword).up();
      });
      serviceDetails
        .ele("TARGET_GROUP")
        .ele("TARGET_GROUP_TEXT")
        .txt(this.courseType.target_group_text)
        .up()
        .up();
      serviceDetails
        .ele("TERMS_AND_CONDITIONS")
        .txt(this.courseType.terms_and_conditions)
        .up();
      const serviceModule = serviceDetails.ele("SERVICE_MODULE");
      const education = serviceModule.ele("EDUCATION", {
        type: combination_index === 0 ? "true" : "false",
      });
      education
        .ele("COURSE_ID")
        .txt(i + "0000")
        .up();
      const degree = education.ele("DEGREE", {
        type: this.courseType.degree_type1,
      });
      degree.ele("DEGREE_TITLE").txt(this.courseType.degree_title).up();
      degree
        .ele("DEGREE_EXAM", { type: this.courseType.degree_type2 })
        .ele("EXAMINER")
        .txt(this.courseType.examiner)
        .up()
        .up();
      degree
        .ele("DEGREE_ADD_QUALIFICATION")
        .txt(this.courseType.degree_add_qualification)
        .up();
      degree
        .ele("DEGREE_ENTITLED")
        .txt(this.courseType.degree_entitled)
        .up()
        .up();
      // education.ele("SUBSIDY").txt(this.courseType.subsidy_description).up();
      // education
      //   .ele("REGISTRATION_DATE")
      //   .txt(this.course.registration_date || "2024-06-24T00:00:00.000+02:00")
      //   .up();
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
        .ele("INSTRUCTION_FORM", { type: this.courseType.instruction_type1 })
        .txt(this.courseType.instruction_form_name)
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
        .ele("EDUCATION_TYPE", { type: this.courseType.education_type2 })
        .txt(this.courseType.education_type2_name)
        .up()
        extendedInfo
        .ele("MEASURE_NUMBER")
        .txt(this.courseType.measure_number)
        .up()
        .up();
      const moduleCourse = education.ele("MODULE_COURSE");
      const location = moduleCourse.ele("LOCATION");
      if (this.courseType.instruction_type1 != "201") {
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

      //   location.ele("ID_DB").txt("1086152").up();
      //   location
      //     .ele("ADDRESS_REMARKS")
      //     .txt(this.organizationSettings.contact_remarks)
      //     .up()
      //     .up();
      moduleCourse
        .ele("DURATION", { type: this.courseType.duration_type })
        .up();
      moduleCourse
        .ele("INSTRUCTION_REMARKS")
        .txt(this.courseType.instruction_remarks)
        .up();
      moduleCourse
        .ele("FLEXIBLE_START")
        .txt(this.courseType.flexible_start)
        .up();
      moduleCourse
        .ele("EXTENDED_INFO")
        .ele("SEGMENT_TYPE", { type: this.courseType.segment_type2 })
        .up()
        .up()
        .up();
      const endDateWithAddedTime = this.addHoursToTime(
        combination.startTime.time,
        8
      );
      // Format the dates as required
      const today = new Date();
      const nextYear = addYears(today, 1);
      const formattedStartDate = format(today, "yyyy-MM-dd'+02:00'");
      const formattedEndDate = format(nextYear, "yyyy-MM-dd'+02:00'");
      // serviceDetails
      //   .ele("ANNOUNCEMENT")
      //   .ele("START_DATE")
      //   // .txt(combination.date.start_date)
      //   .txt(formattedStartDate)
      //   .up()
      //   .ele("END_DATE")
      //   //plus 8 urhzeit TODO
      //   // .txt(combination.date.end_date)
      //   .txt(formattedEndDate)
      //   .up()
      //   .up();
      service
        .ele("SERVICE_CLASSIFICATION")
        .ele("REFERENCE_CLASSIFICATION_SYSTEM_NAME")
        .txt("Kurssystematik")
        .up()
        .ele("FEATURE")
        .ele("FNAME")
        .txt(this.courseType.fname)
        .up()
        .ele("FVALUE")
        .txt(this.courseType.fvalue)
        .up()
        .up()
        .up();
      service
        .ele("SERVICE_PRICE_DETAILS")
        .ele("SERVICE_PRICE")
        .ele("PRICE_AMOUNT")
        .txt(this.courseType.price_amount)
        .up()
        .ele("PRICE_CURRENCY")
        .txt(this.courseType.price_currency)
        .up()
        .up()
        .ele("REMARKS")
        .txt(this.courseType.subsidy_description)
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
    return root.end({ prettyPrint: true });
  }
}

export default XmlHelper;
