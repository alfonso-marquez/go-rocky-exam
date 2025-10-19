"use client";

import { Label } from "@radix-ui/react-label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag } from "../photo/types";
import { Tag as TagIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

export default function TagFormDialog({
  tags,
  onTagCreate,
}: {
  tags: Tag[];
  onTagCreate: (newTag: Tag) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // change later
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) return; // simple validation
    setLoading(true);

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error("Tag Creation Failed", {
          description: err.error,
        });
        throw new Error(err.error || "Failed to create tag");
      }

      const newTag = await res.json();
      onTagCreate(newTag);
      toast.success("Success!", {
        description: "Your tag has been created successfully.",
      });

      // Optionally update local state to show the new tag
      // setTags((prev: Tag[]) => [...prev, newTag]);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
      setName("");
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <TagIcon /> Manage Tags
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tags</DialogTitle>
          <DialogDescription>Manage your Tags</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <div className="flex flex-col gap-6">
            <Label htmlFor="tag-name">Name</Label>
            <div className="flex gap-2 ">
              <Input
                className="w-2/3"
                id="tag-name"
                placeholder="Tag Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} className="w-1/3">
                {loading ? (
                  <>
                    <Spinner />
                    <span>Creating Tag</span>
                  </>
                ) : (
                  "Create Tag"
                )}
              </Button>
            </div>
          </div>
        </form>
        <div className="flex flex-wrap gap-2 mt-5">
          {tags.length === 0 && !loading ? (
            <span>No Tags yet.</span>
          ) : (
            tags.map((tag: Tag) =>
              tag.name ? (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ) : null,
            )
          )}

          {loading && <Badge variant="default">Creating...</Badge>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
