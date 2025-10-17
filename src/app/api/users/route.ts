import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const GET = async () => {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase.from("profiles").select();
  console.log("Fetched profiles:", profiles);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(profiles);
};

export { GET };
