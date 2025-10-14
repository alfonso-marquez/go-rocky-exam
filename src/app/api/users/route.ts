import { createClient } from "@/utils/supabase/server";

const GET = async () => {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();
  return new Response(JSON.stringify(users), { status: 200 });
};

export { GET };
