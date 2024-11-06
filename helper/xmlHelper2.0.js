import HeaderHelper from './HeaderHelper';
import IterationalHelper from './IterationalHelper2.0';

class XmlHelper {
  constructor(organizationSettings, selectedCourses, type) {
    this.organizationSettings = organizationSettings;

    const { $supabase } = useNuxtApp();
    this.supabase = $supabase;
    this.selectedCourses = selectedCourses;
    this.type = type;
  }

  async generateXml() {
    const headerHelper = new HeaderHelper(this.organizationSettings);  // Correct variable name for instance
    const root = headerHelper.generateFixedData();

  debugger
  let newCatalog = ""
  if(this.type === "new") {
     newCatalog = root.ele("NEW_CATALOG", { FULLCATALOG: "true" });
  } else if(this.type === "update"){
    newCatalog = root.ele("UPDATE_CATALOG", { seq_number: "1730890510479" });
  } else {
    
  }

  
    const iterationalHelper2 = new IterationalHelper(this.organizationSettings);  // Use a different name for the instance
    await iterationalHelper2.generateServiceElements(newCatalog, this.selectedCourses);  // Correct the instance name
  
    return root.end({ prettyPrint: true });
  }
}

export default XmlHelper;
