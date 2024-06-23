import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lnacwzshltbjotnpvien.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYWN3enNobHRiam90bnB2aWVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTExOTM1MCwiZXhwIjoyMDM0Njk1MzUwfQ.ZSmKel80I_o3JbBKbK0plyzxQ-6xOBzx7A4edFjcnLU'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      supabase,
    },
  }
})
