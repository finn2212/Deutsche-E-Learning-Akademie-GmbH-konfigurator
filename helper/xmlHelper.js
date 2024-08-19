import HeaderHelper from './HeaderHelper';
import IterationalHelper from './IterationalHelper';

class XmlHelper {
  constructor(organizationSettings, selectedCourses) {
    this.organizationSettings = organizationSettings;

    const { $supabase } = useNuxtApp();
    this.supabase = $supabase;
    this.selectedCourses = selectedCourses;
  }

  async generateXml() {
    const headerHelper = new HeaderHelper(this.organizationSettings);  // Correct variable name for instance
    const root = headerHelper.generateFixedData();
  
    const newCatalog = root.ele("NEW_CATALOG", { FULLCATALOG: "true" });
  
    const iterationalHelper = new IterationalHelper(this.organizationSettings);  // Use a different name for the instance
    await iterationalHelper.generateServiceElements(newCatalog, this.selectedCourses);  // Correct the instance name
  
    return root.end({ prettyPrint: true });
  }
}

export default XmlHelper;
