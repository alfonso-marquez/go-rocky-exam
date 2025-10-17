import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // your helper
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: Request) => {
  const supabase = await createClient();
  const formData = await req.formData();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;

  const title = formData.get("title");
  const description = formData.get("description");
  const createdAt = new Date().toISOString();

  const file = formData.get("file") as File;
  const albumId = formData.get("albumId");
  const user = (await supabase.auth.getUser()).data.user;

  if (!file || !albumId || !user) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  // Insert photo record
  const { data: photo, error: dbError } = await supabase
    .from("photos")
    .insert({
      title,
      description,
      album_id: albumId,
      user_id: user.id,
      url: publicUrlData.publicUrl,
      created_at: createdAt,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, photo });
};
