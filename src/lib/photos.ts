// Fetch all photos
import { createClient } from "@/utils/supabase/server";

const getPhotos = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select(
      `
    *,
    profiles (
      first_name, last_name
    )
  `,
    )
    .order("created_at", { ascending: true }); // returns `data = null` if not found;
  if (error) throw new Error(error?.message || "Failed to fetch photos");
  return data || []; // always return array, safe for UI
};

export { getPhotos };
