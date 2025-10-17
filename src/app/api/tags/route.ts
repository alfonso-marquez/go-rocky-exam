import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getTags } from "@/lib/tags";

interface Params {
  params: { id: string };
}
//legit
const GET = async () => {
  try {
    const tags = await getTags(); // uses lib helper
    console.log("tags", tags);
    return NextResponse.json(tags, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

const POST = async (req: Request) => {
  const supabase = await createClient();
  // Authenticated users only
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json(
      { error: "Tag name is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("tags").insert({ name }).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
};

const PATCH = async ({ params }: Params, req: Request) => {
  const supabase = await createClient();

  // Authenticated users only
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json(
      { error: "Tag name is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("tags")
    .update({ name })
    .eq("id", params.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

const DELETE = async (req: Request) => {
  const supabase = await createClient();
  // Authenticated users only
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Tag id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tags")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export { GET, POST, PATCH, DELETE };
