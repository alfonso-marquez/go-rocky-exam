// Fetch all albums
import { createClient } from "@/utils/supabase/server";

const getAlbums = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select(
      `
        *,
        photos (
        url,
        created_at
        )
      `,
    )
    .eq("user_id", id);
  if (error) throw new Error(error?.message || "Failed to fetch albums");
  return data || []; // always return array, safe for UI
};

// GET single album by id
const getAlbum = async (id: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select(`*, profiles (first_name, last_name)`)
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") {
      return { data: null, error: error.message || "404 Not Found" };
    } else {
      return { data: null, error: error.message || "Internal Server Error" };
    }
  }
  return { data, error: null };
};

const createAlbum = async (
  name: string,
  description: string,
  userId: string,
) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .insert({ name, description, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error?.message || "Failed to create album");
  return data || []; // return array of created albums
};

const updateAlbum = async (id: number, name: string, description: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .update({ name, description, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(
      `id,
      name,
      description,
      photos (
        id,
        url,
        created_at
      )`,
    )
    .single();
  if (error)
    throw new Error(error.message || `Failed to update album with id ${id}`);
  return data || []; // return array of updated albums
};

const deleteAlbum = async (id: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .delete()
    .eq("id", id)
    .select();
  if (error)
    throw new Error(error?.message || `Failed to delete album with id ${id}`);
  return data || []; // return array of deleted albums
};

export { getAlbums, getAlbum, createAlbum, updateAlbum, deleteAlbum };

export type Album = {
  id: string;
  name: string;
};

export type Albums = Album[];
