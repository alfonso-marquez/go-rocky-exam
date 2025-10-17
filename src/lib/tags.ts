// Fetch all tags
import { createClient } from "@/utils/supabase/server";

const getTags = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select();
  if (error) throw new Error(error?.message || "Failed to fetch tags");
  return data || []; // always return array, safe for UI
};

// GET single tag by id
const getTag = async (id: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select()
    .eq("id", id)
    .single();
  if (error)
    throw new Error(error?.message || `Failed to fetch tag with id ${id}`);
  return data; // single object or throws
};

// CREATE tag
const createTag = async (name: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").insert({ name }).select();
  if (error) throw new Error(error?.message || "Failed to create tag");
  return data || []; // return array of created tags
};

// UPDATE tag
const updateTag = async (id: number, name: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .update({ name })
    .eq("id", id)
    .select();
  if (error)
    throw new Error(error?.message || `Failed to update tag with id ${id}`);
  return data || []; // return array of updated tags
};

// DELETE tag
const deleteTag = async (id: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .delete()
    .eq("id", id)
    .select();
  if (error)
    throw new Error(error?.message || `Failed to delete tag with id ${id}`);
  return data || []; // return array of deleted tags
};

export { getTags, createTag, updateTag, deleteTag };

export type Tag = {
  id: string;
  name: string;
};

export type Tags = Tag[];
