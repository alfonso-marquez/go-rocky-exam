"use client";

import { useEffect, useState } from "react";
import { Photo } from "./types";
import Image from "next/image";
import LoadingState from "../LoadingState";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "../ui/empty";
import { Frown } from "lucide-react";

export default function PhotoList() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/photos", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch photos");
        }

        const photos = await res.json();
        setPhotos(photos);
      } catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  if (loading) {
    return <LoadingState height={500} width={300} isCentered={true} />;
  }

  if (!loading && photos.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Frown />
          </EmptyMedia>
          <EmptyTitle>No Photos Found</EmptyTitle>
          <EmptyDescription>
            It&apos;s quiet here... upload your first shot to bring this space
            to life.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <section id="photo-list">
      <div className="container">
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative overflow-hidden group rounded-md"
              aria-hidden="false"
            >
              <Image
                src={photo.url}
                height={500}
                width={500}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover block transition-transform duration-700 ease-in-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center pointer-events-none group-hover:pointer-events-auto z-10">
                <p className="text-white text-lg font-semibold text-center justify">
                  {photo.title}
                </p>
                <p className="text-white text-lg">{photo.description}</p>
                <p className="text-white text-lg">{photo.details}</p>
                <p className="text-white text-lg">
                  Owner: {photo.profiles?.first_name || "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
