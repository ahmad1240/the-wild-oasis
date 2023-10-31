import supabase from "./supabase";

export async function getAllGuests() {
  const { data, error } = await supabase.from("guests").select("*");
  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
