import { create } from 'xmlbuilder2';

class HeaderHelper {
    constructor(organizationSettings) {
      this.organizationSettings = organizationSettings;
    }

    getCurrentFormattedDate() {
      const date = new Date();
      const offset = -date.getTimezoneOffset();
      const sign = offset >= 0 ? "+" : "-";
      const pad = num => String(num).padStart(2, "0");
  
      const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${String(date.getMilliseconds()).padStart(3, "0")}${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
      return dateString;
    }
  
    generateFixedData() {
      return create({
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
        .txt("Stübi Export 0.1")
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
        .txt(this.getCurrentFormattedDate())
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
        .txt("Deutsche E-Learning Akademie")
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
        .ele("COUNTRY")
        .txt("DE")
        .up()
        .ele("URL")
        .txt("https://www.dela-akademie.de/")
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
        .ele("CONTACT_ROLE", { type: "2" })
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
        .ele("EXTENDED_INFO", { input_type: "2" })
        .ele("ORGANIZATIONAL_FORM", { type: "2" })
        .txt("Private Bildungseinrichtung")
        .up()
        .up()
        .up()
        .up();
    }
  }
  export default HeaderHelper;
  