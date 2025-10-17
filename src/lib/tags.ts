// Fetch all tags
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const getTags = async () => {
  const supabase = await createClient();
  try {
    const { data: tags, error } = await supabase.from("tags").select();
    console.log("tags", tags);
    return NextResponse.json(tags, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
// Fetch single tag by ID
const getTag = async (id: string) => {
  const supabase = await createClient();

  const { data: tag, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !tag) throw new Error(error?.message || "Tag not found");

  return tag;
};

// Create a new Tag
const createTag = async (data: { name: string; description?: string }) => {
  const res = await fetch("/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create album");
  return res.json();
};

// Update Tag by ID
const updateTag = async (
  id: string,
  data: Partial<{ name: string; description: string }>
) => {
  const res = await fetch(`/api/tags/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update album");
  return res.json();
};

// Delete Tag by ID
const deleteTag = async (id: string) => {
  const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete album");
  return res.json();
};

export { getTags, getTag, createTag, updateTag, deleteTag };

export type Tag = {
  id: string;
  name: string;
};

export type Tags = Tag[];
