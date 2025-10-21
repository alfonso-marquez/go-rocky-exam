import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from "@/lib/albums";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const GET = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const albums = await getAlbums(user.id);
    return NextResponse.json(albums, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
};

// POST - create a new album (authenticated)
const POST = async (req: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, description } = await req.json();
  if (!name)
    return NextResponse.json(
      { error: "Album name is required" },
      { status: 400 },
    );

  try {
    const data = await createAlbum(name, description, user.id);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
};

// PATCH - update album (authenticated)
const PATCH = async (req: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, name, description } = await req.json();

  try {
    const data = await updateAlbum(id, name, description);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
};

// DELETE - delete album (authenticated)
const DELETE = async (req: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id)
    return NextResponse.json(
      { error: "Album id is required" },
      { status: 400 },
    );

  try {
    const data = await deleteAlbum(id);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
};

export { GET, POST, PATCH, DELETE };
