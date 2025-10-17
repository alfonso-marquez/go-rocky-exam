import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from "@/lib/albums";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const GET = async () => {
  try {
    const tags = await getAlbums();
    return NextResponse.json(tags, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// POST - create a new tag (authenticated)
const POST = async (req: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name)
    return NextResponse.json(
      { error: "Album name is required" },
      { status: 400 }
    );

  try {
    const data = await createAlbum(name);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// PATCH - update a tag (authenticated)
const PATCH = async (req: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, name } = await req.json();
  if (!id || !name)
    return NextResponse.json(
      { error: "Album id and name are required" },
      { status: 400 }
    );

  try {
    const data = await updateAlbum(id, name);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// DELETE - delete a tag (authenticated)
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
      { status: 400 }
    );

  try {
    const data = await deleteAlbum(id);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export { GET, POST, PATCH, DELETE };
