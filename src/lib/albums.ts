// Fetch all albums
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

// GET single tag by id
const getAlbum = async (id: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select()
    .eq("id", id)
    .single();
  if (error) {
    // Handle not found separately
    if (error.code === "PGRST116") {
      // Supabase “no rows returned” code
      console.error(new Error(error.message || "404 Not Found"));
      redirect("/albums");
    } else {
      // Supabase “no rows returned” code
      console.error(new Error(error.message || "Internal Server Error"));
      redirect("/albums");
    }
  }
  return data; // single object or throws
};

// CREATE tag
const createAlbum = async (name: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .insert({ name })
    .select();
  if (error) throw new Error(error?.message || "Failed to create album");
  return data || []; // return array of created albums
};

// UPDATE tag
const updateAlbum = async (id: number, name: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .update({ name })
    .eq("id", id)
    .select();
  if (error)
    throw new Error(error.message || `Failed to update album with id ${id}`);
  return data || []; // return array of updated albums
};

// DELETE tag
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
