import { createClient } from "@/utils/supabase/client";

const GET = async () => {
  const supabase = await createClient();
  const { data: albums } = await supabase.from("albums").select();
  console.log("Fetched albums:", albums);
  return new Response(JSON.stringify(albums), { status: 200 });
};

export { GET };

// export async function POST(req: NextRequest) {
//   const supabase = createClient();
//   const body = await req.json();

//   const { name, description, user_id } = body;

//   const { data, error } = await supabase
//     .from("albums")
//     .insert({ name, description, user_id })
//     .select()
//     .single();

//   if (error)
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json(data, { status: 201 });
// }
