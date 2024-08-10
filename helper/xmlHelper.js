import FixedDataHelper from './fixedDataHelper';
import IterationHelper from './IterationHelper';

class XmlHelper {
  constructor(organizationSettings, selectedCourses) {
    this.organizationSettings = organizationSettings;

    const { $supabase } = useNuxtApp();
    this.supabase = $supabase;
    this.selectedCourses = selectedCourses;
  }

  async generateXml() {
    const fixedDataHelper = new FixedDataHelper(this.organizationSettings);
    const root = fixedDataHelper.generateFixedData();
  
    const newCatalog = root.ele("NEW_CATALOG", { FULLCATALOG: "true" });
  
    const iterationHelper = new IterationHelper(this.organizationSettings);
    await iterationHelper.generateServiceElements(newCatalog, this.selectedCourses);
  
    return root.end({ prettyPrint: true });
  }
  
}

export default XmlHelper;
