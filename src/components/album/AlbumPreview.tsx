"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // your Supabase client
import Image from "next/image";
import AddPhotoDialog from "../photo/AddPhotoDialog";
import { Photo, Tag } from "../photo/types";
import PhotoFormDialog from "../photo/PhotoFormDialog";
import TagFormDialog from "../tag/TagFormDialog";

export default function AlbumPreview({ albumId }: { albumId: number }) {
  // fetch data
  // change type
  const [photos, setPhotos] = useState<Photo[]>([]); // change type
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const supabase = createClient(); // client-side version, not awaited
        const { data, error } = await supabase
          .from("photos")
          .select(
            `*,
              photo_tags (
              tag_id,
              tags (
                id,
                name
              )
            )
          `,
          )
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

  // useEffect(() => {
  //   fetch("/api/tags")
  //     .then((res) => res.json())
  //     .then(setTags);
  // }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch tags");
        }

        const tags = await res.json();
        setTags(tags.map((tag: Tag) => ({ ...tag, selected: false })));
      } catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
      }
    };
    fetchTags();
  }, []);

  const handlePhotoAdded = (newPhoto: Photo) => {
    // change type
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  return (
    <section>
      <div className="flex gap-4 justify-end p-4">
        <TagFormDialog tags={tags} setTags={setTags} />
        <AddPhotoDialog
          albumId={String(albumId)}
          onPhotoAdded={handlePhotoAdded}
        />
      </div>
      {loading && <p>Loading photos...</p>}
      {photos.length === 0 && <p>No photos found for this album.</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-lg shadow-sm group"
          >
            <Image
              src={photo.url}
              alt={photo.title || "Photo"}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
            />

            {/* Optional hover dark overlay (if you still want it) */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
              <PhotoFormDialog
                photo={photo}
                setPhotos={setPhotos}
                tags={tags}
              />
              <p className="text-white text-lg font-semibold">{photo.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
