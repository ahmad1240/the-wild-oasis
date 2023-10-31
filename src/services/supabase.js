import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://voyihpgeeoghzzihmkyx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveWlocGdlZW9naHp6aWhta3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcwMjkyMDEsImV4cCI6MjAxMjYwNTIwMX0.MPtypyyxxA7fsZM8W9P6uHP68VpD5oY3K-F_mueI6u0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
