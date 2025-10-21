import AlbumDetails from "@/components/album/AlbumDetails";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAlbum } from "@/lib/albums";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function AlbumPreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  // Handle await params NextJS
  const albumId = Number(params.id);
  const album = await getAlbum(albumId);
  console.log(album);
  let isUserAlbum = false;

  if (data.user.id == album.user_id) {
    isUserAlbum = true;
  }

  return (
    <>
      <div className="font-sans flex flex-col items-center justify-center min-w-[320px] w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-16 gap-10 max-w-7xl mx-auto mt-10">
        <div className="w-full max-w-6xl">
          <Card className="w-full shadow-md">
            <CardHeader className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">{album.name}</h1>
              <h2 className="text-gray-600 text-base">{album.description}</h2>
              {isUserAlbum && (
                <h3 className="text-gray-600 text-sm">
                  You created this album
                </h3>
              )}
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
    </>
  );
}
