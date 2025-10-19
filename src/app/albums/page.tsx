import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AlbumClientWrapper from "@/components/album/AlbumClientWrapper";

export default async function Albums() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  // fetch initial albums
  const { data: albums } = await supabase
    .from("albums")
    .select(
      `
      *,
      photos (
      url,
      created_at
      )
    `,
    )
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  if (albums) {
    console.log(albums);
  }

  return (
    <div className="flex flex-col items-center  p-8 pb-20 gap-16 sm:p-20 max-w-7xl mx-auto">
      <div className="mx-auto my-30 w-full max-w-6xl">
        <AlbumClientWrapper initialAlbums={albums || []} />
      </div>
    </div>
  );
}
