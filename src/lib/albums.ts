// Fetch all albums
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const getAlbums = async () => {
  const supabase = await createClient();
  try {
    const { data: albums, error } = await supabase.from("albums").select();
    console.log("albums", albums);
    return NextResponse.json(albums, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Fetch single album by ID
const getAlbum = async (id: string) => {
  const supabase = await createClient();

  const { data: album, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !album) throw new Error(error?.message || "Album not found");

  return album;
};

// Create a new album
const createAlbum = async (data: { name: string; description?: string }) => {
  const res = await fetch("/api/albums", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create album");
  return res.json();
};

// Update album by ID
const updateAlbum = async (
  id: string,
  data: Partial<{ name: string; description: string }>
) => {
  const res = await fetch(`/api/albums/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update album");
  return res.json();
};

// Delete album by ID
const deleteAlbum = async (id: string) => {
  const res = await fetch(`/api/albums/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete album");
  return res.json();
};

export { getAlbums, getAlbum, createAlbum, updateAlbum, deleteAlbum };

export type Album = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export type Albums = Album[];
