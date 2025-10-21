import AlbumDetails from "@/components/album/AlbumDetails";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAlbum } from "@/lib/albums";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface AlbumPreviewParams {
  id: string;
}

export default async function AlbumPreviewPage({
  params,
}: {
  params: AlbumPreviewParams;
}) {
  const albumId = Number(params.id);

  const { data: album, error: albumError } = await getAlbum(albumId);

  // Handle 404
  if (albumError) {
    return notFound();
  }

  let isUserAlbum = false;

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    redirect("/login");
  }

  if (authData.user.id === album.user_id) {
    isUserAlbum = true;
  }

  return (
    <div className="flex flex-col items-center justify-center min-w-[320px] w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-16 gap-10 max-w-7xl mx-auto mt-10">
      <div className="w-full max-w-6xl">
        <Card className="w-full shadow-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-800">
              {album?.name || "Album name"}
            </h1>
            <h2 className="text-gray-600 text-base">
              {album?.description || "Album description"}
            </h2>
            <h3 className="text-gray-600 text-sm">
              {isUserAlbum
                ? "You created this album"
                : `Created by ${album?.profiles?.first_name || ""} ${album?.profiles?.first_name || ""}`}
            </h3>
          </CardHeader>
        </Card>

        <div className="mt-6">
          <Card className="w-full min-w-[300px] shadow-sm">
            <CardContent>
              <AlbumDetails albumId={albumId} isUserAlbum={isUserAlbum} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
