"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Album } from "./types";
import { toast } from "sonner";

export default function AlbumFormDialog({
  onAlbumCreate,
}: {
  onAlbumCreate: (newTag: Album) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return alert("Album name required");
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setLoading(true);

    try {
      const res = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, user_id: user?.id }),
      });

      if (!res.ok) throw new Error("Album creation failed");
      const newAlbum = await res.json();

      onAlbumCreate({ ...newAlbum, photos: newAlbum.photos || [] });
      router.refresh(); //  re-fetch albums list (server component)
      setName("");
      setDescription("");
      setOpen(false);

      toast.success("Album created successfully.");
    } catch {
      toast.error("Album creation failed. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus /> Add Album
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Album</DialogTitle>
          <DialogDescription>
            Add a new album to organize your photos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="album-name">Name</Label>
              <Input
                id="album-name"
                placeholder="My Album"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? (
                <>
                  <Spinner />
                  <span>Creating Album</span>
                </>
              ) : (
                <span>Create Album</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
