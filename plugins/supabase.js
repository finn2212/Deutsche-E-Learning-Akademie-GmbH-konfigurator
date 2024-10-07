import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lnacwzshltbjotnpvien.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYWN3enNobHRiam90bnB2aWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkxMTkzNTAsImV4cCI6MjAzNDY5NTM1MH0.I6c6y6dtqUr_41T5rskfS_RV0egb07dyLQZjBkpUl0c'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      supabase,
    },
  }
})