import HeaderHelper from "./HeaderHelper";
import ServiceHelper from "./serviceHelper";

class XmlHelper {
  constructor(organizationSettings, selectedCourses, type) {
    this.organizationSettings = organizationSettings;

    const { $supabase } = useNuxtApp();
    this.supabase = $supabase;
    this.selectedCourses = selectedCourses;
    this.type = type;
  }

  async getSequenceNumber() {
    try {
      // Step 1: Fetch the current sequence number
      const { data, error } = await this.supabase
        .from("sequence_tracker")
        .select("id, current_sequence")
        .limit(1)
        .single();

      if (error && error.code === "PGRST204") {
        // If no record is found, insert an initial row
        const { data: newData, error: insertError } = await this.supabase
          .from("sequence_tracker")
          .insert({ current_sequence: 1 })
          .select()
          .single();

        if (insertError) throw insertError;

        return newData.current_sequence; // Return 1 as the initial sequence number
      } else if (error) {
        throw error;
      }

      const currentSequence = data.current_sequence;

      // Step 2: Increment the sequence number and update the database
      const { error: updateError } = await this.supabase
        .from("sequence_tracker")
        .update({ current_sequence: currentSequence + 1 })
        .eq("id", data.id);

      if (updateError) throw updateError;

      // Return the sequence number before incrementing, as required for XML
      return currentSequence;
    } catch (error) {
      console.error("Error fetching or updating sequence number:", error);
      throw error;
    }
  }

  async generateXml() {
    const headerHelper = new HeaderHelper(this.organizationSettings); // Correct variable name for instance
    const root = headerHelper.generateFixedData();

    let newCatalog = "";
    if (this.type === "new") {
      newCatalog = root.ele("NEW_CATALOG", { FULLCATALOG: "true" });
    } else if (this.type === "update") {
      const seqNumber = await this.getSequenceNumber();
      const updateCatalog = root.ele("UPDATE_CATALOG", {
        seq_number: seqNumber,
      });
      newCatalog = updateCatalog.ele("NEW"); // Creates the <NEW> element inside <UPDATE_CATALOG>
    } else {
    }
    const serviceHelper = new ServiceHelper(this.organizationSettings); // Use a different name for the instance
    await serviceHelper.generateServiceElements(
      newCatalog,
      this.selectedCourses
    ); // Correct the instance name

    return root.end({ prettyPrint: true });
  }
}

export default XmlHelper;
