"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // your Supabase client
import Image from "next/image";
import AddPhotoDialog from "../photo/AddPhotoDialog";
import { Photo, Tag } from "../photo/types";
import PhotoFormDialog from "../photo/PhotoFormDialog";
import TagFormDialog from "../tag/TagFormDialog";
import EmptyState from "../EmptyState";

export default function AlbumDetails({
  albumId,
  isUserAlbum,
}: {
  albumId: number;
  isUserAlbum: boolean;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]); // change type
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchPhotos = useCallback(async () => {
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
  }, [albumId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch("/api/tags");

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch tags");
      }

      const tags = await res.json();
      setTags(tags.map((tag: Tag) => ({ ...tag, selected: false })));
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // handle new tag creation
  const handleTagCreated = (newTag: Tag) => {
    setTags((prev) => [...prev, newTag]); // optional optimistic update
    fetchTags(); // refetch to ensure DB sync
  };

  const handlePhotoAdded = (newPhoto: Photo) => {
    // change type
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  if (!loading && photos.length === 0) {
    return (
      <>
        <div className="flex gap-4 justify-end p-4">
          <TagFormDialog tags={tags} onTagCreate={handleTagCreated} />
          <AddPhotoDialog
            albumId={String(albumId)}
            onPhotoAdded={handlePhotoAdded}
          />
        </div>
        <EmptyState type="photo" />
      </>
    );
  }

  return (
    <section>
      {isUserAlbum && (
        <div className="flex gap-4 justify-end p-4">
          <TagFormDialog tags={tags} onTagCreate={handleTagCreated} />
          <AddPhotoDialog
            albumId={String(albumId)}
            onPhotoAdded={handlePhotoAdded}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
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
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
              {isUserAlbum && (
                <PhotoFormDialog
                  photo={photo}
                  setPhotos={setPhotos}
                  tags={tags}
                />
              )}
              <p className="text-white text-lg font-semibold">{photo.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
