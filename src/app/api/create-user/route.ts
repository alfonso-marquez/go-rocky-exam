import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
const supabase = await createClient();

const POST = async (req: Request) => {
  const body = await req.json();
  const { first_name, last_name, email } = body;

  // Get currently logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Insert into users table
  const { error } = await supabase.from("users").insert({
    id: user.id,
    first_name,
    last_name,
    email,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
};

export { POST };
