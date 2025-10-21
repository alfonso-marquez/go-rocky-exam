import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import AlbumClientWrapper from "@/components/album/AlbumClientWrapper";

export default async function Albums() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  let albums;
  let errorMessage = null;

  const cookieStore = await cookies();
  // fetch initial albums
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/albums`, {
      headers: { cookie: cookieStore.toString() },
    });

    if (!res.ok) throw new Error("Failed to fetch albums");

    albums = await res.json();
  } catch {
    errorMessage = "Albums Fetch Failed. Please contact support.";
  }

  return (
    <div className="flex flex-col items-center  p-8 pb-20 gap-16 sm:p-20 max-w-7xl mx-auto">
      <div className="mx-auto my-30 w-full max-w-6xl">
        <AlbumClientWrapper
          initialAlbums={albums || []}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}
