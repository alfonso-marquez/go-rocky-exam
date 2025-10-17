"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // your Supabase client
import Image from "next/image";
import AddPhotoDialog from "../photo/AddPhotoDialog";
import { Photo } from "../photo/types";

export default function AlbumPreview({ albumId }: { albumId: number }) {
  // fetch data
  // change type
  const [photos, setPhotos] = useState<Photo[]>([]); // change type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const supabase = createClient(); // client-side version, not awaited
        const { data, error } = await supabase
          .from("photos")
          .select("*")
          .eq("album_id", albumId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setPhotos(data || []);
      } catch (err) {
        console.error("Error fetching photos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [albumId]);

  const handlePhotoAdded = (newPhoto: Photo) => {
    // change type
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  return (
    <section>
      <div className="flex justify-end p-4">
        <AddPhotoDialog
          albumId={String(albumId)}
          onPhotoAdded={handlePhotoAdded}
        />
      </div>
      {loading && <p>Loading photos...</p>}
      {photos.length === 0 && <p>No photos found for this album.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-lg shadow-sm"
          >
            <Image
              src={photo.url}
              alt={photo.title || "Photo"}
              className="object-cover transition-transform duration-300 hover:scale-105"
              fill
            />
          </div>
        ))}
      </div>
    </section>
  );
}
