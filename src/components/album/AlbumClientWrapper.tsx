"use client";

import { useState } from "react";
import AlbumFormDialog from "./AlbumFormDialog";
import AlbumList from "./AlbumList";
import { Card, CardContent } from "@/components/ui/card";
import { Album } from "./types";
export default function AlbumClientWrapper({
  initialAlbums,
}: {
  initialAlbums: Album[];
}) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [loading, setLoading] = useState(false);

  const handleAlbumCreated = (newAlbum: Album) => {
    setLoading(true);
    setAlbums((prev) => [...prev, newAlbum]); // update state immediately
    setLoading(false);
  };

  const handleAlbumDelete = (id: string) => {
    setAlbums((prev) => prev.filter((album) => album.id !== id));
  };

  const handleAlbumEdit = (album: Album) => {
    setAlbums((prev) => prev.map((a) => (a.id === album.id ? album : a)));
  };

  return (
    <Card>
      <div className="flex items-center justify-center px-10 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold md:mb-2">
            My Albums
          </h1>
          <p className="text-muted-foreground">All albums</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <AlbumFormDialog onAlbumCreate={handleAlbumCreated} />
        </div>
      </div>
      <CardContent>
        <AlbumList
          albums={albums}
          loading={loading}
          onAlbumEdit={handleAlbumEdit}
          onAlbumDelete={handleAlbumDelete}
        />
      </CardContent>
    </Card>
  );
}
