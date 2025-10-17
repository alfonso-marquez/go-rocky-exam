"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { IconFolderCode } from "@tabler/icons-react";
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AlbumFormDialog from "./AlbumFormDialog";
import { Card } from "../ui/card";
import { ArchiveIcon, Eye, MailCheckIcon, MoreHorizontalIcon, Trash, Trash2Icon } from "lucide-react";
import Link from "next/link";
import EditFormDialog from "./EditFormDialog";
import { Album } from "./types";
import { Skeleton } from "../ui/skeleton";

export default function AlbumList() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const fetchAlbums = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data, error } = await supabase
                .from("albums")
                .select(`
                    *,
                    photos (
                    url
                    )
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            setAlbums(data || []);
            console.log(data);
        } catch (error) {
            console.error("Error fetching albums:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAlbum = async (id: string) => {
        if (!confirm("Delete this album?")) return;
        const { error } = await supabase.from("albums").delete().eq("id", id);
        if (!error) fetchAlbums();
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    return (
        <div className="container mx-auto p-6">
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="space-y-2">
                            {/* Skeleton for the image */}
                            <Skeleton className="w-full h-50 rounded-md" />
                            {/* Skeleton for text lines */}
                            <Skeleton className="h-5 w-3/4" />
                        </div>
                    ))}
                </div>
            ) : albums.length === 0 ? (<Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <IconFolderCode />
                    </EmptyMedia>
                    <EmptyTitle>No Albums Yet</EmptyTitle>
                    <EmptyDescription>
                        You haven&apos;t created any albums yet. Get started by creating
                        your first album.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex gap-2">
                        <AlbumFormDialog />
                    </div>
                </EmptyContent>
            </Empty>) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {albums.map((album) => {
                    const coverUrl = album.photos?.length
                        ? album.photos.reduce((latest, current) => {
                            return new Date(current.created_at).getTime() > new Date(latest.created_at).getTime()
                                ? current
                                : latest;
                        }).url
                        : "https://placehold.co/400";
                    return (
                        <Card
                            key={album.id}
                            className="border rounded-lg flex flex-col items-center justify-between p-4 w-full aspect-square"
                        >
                            <div className="action-buttons-div w-full flex justify-end mb-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" aria-label="More Options">
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
                                            <DropdownMenuItem variant="destructive" onClick={() => deleteAlbum(album.id?.toString())}>
                                                <Trash2Icon />
                                                Delete Album
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>


                            <div className="w-full h-0 pb-[100%] relative rounded-md overflow-hidden mb-2">
                                <Link href={`/album-preview/${album.id}`} passHref>
                                    <img
                                        src={coverUrl} // <-- use first photo or placeholder
                                        alt={album.name}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </Link>
                            </div>


                            <div className="flex justify-between items-center w-full min-w-0 gap-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-md truncate">{album.name}</h3>
                                </div>
                                <EditFormDialog album={album} setAlbums={setAlbums} />
                            </div>
                        </Card>
                    );
                })}

            </div>
            )}
        </div >
    );
}
