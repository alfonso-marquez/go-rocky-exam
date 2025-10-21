"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "../ui/card";
import { Eye, MoreHorizontalIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import EditFormDialog from "./EditFormDialog";
import { Album } from "./types";
import Image from "next/image";
import AlbumDeleteDialog from "./AlbumDeleteDialog";
import EmptyState from "../EmptyState";

type AlbumListProps = {
  albums: Album[];
  loading: boolean;
  onAlbumEdit: (album: Album) => void;
  onAlbumDelete: (id: string) => void;
};

export default function AlbumList({
  albums,
  loading,
  onAlbumEdit,
  onAlbumDelete,
}: AlbumListProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  if (!loading && albums.length === 0) {
    return <EmptyState type="album" />;
  }

  return (
    <div className="container mx-auto p-6">
      <AlbumDeleteDialog
        open={openModal}
        id={selectedId || ""}
        onOpenChange={setOpenModal}
        onAlbumDelete={onAlbumDelete}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {albums.length === 0 && <EmptyState type="album" />}
        {albums.map((album) => {
          const latestPhoto = album.photos?.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )[0];
          const coverUrl = latestPhoto?.url;
          return (
            <Card
              key={album.id}
              className="border rounded-md flex flex-col items-center justify-between px-4 w-full aspect-square relative"
            >
              <div className="action-buttons-div w-full flex justify-end absolute right-4 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label="More Options">
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuGroup>
                      <Link href={`/album-preview/${album.id}`}>
                        <DropdownMenuItem>
                          <Eye />
                          Preview Album
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <button
                          onClick={() => {
                            setSelectedId(album.id);
                            setOpenModal(true);
                          }}
                          className="flex gap-2 w-full"
                        >
                          <Trash2 color="red" />
                          Delete Album
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="w-full h-0 pb-[100%] relative rounded-md overflow-hidden">
                <Link href={`/album-preview/${album.id}`} passHref>
                  <Image
                    src={coverUrl || "/placeholder.jpeg"} // <-- use first photo or placeholder
                    alt={album.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    fill
                    loading="lazy"
                  />
                </Link>
              </div>
              <div className="flex justify-between items-center w-full min-w-0">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-md truncate">{album.name}</h3>
                </div>
                <EditFormDialog album={album} onAlbumEdit={onAlbumEdit} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
