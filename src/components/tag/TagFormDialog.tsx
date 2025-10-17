"use client";

import { Label } from "@radix-ui/react-label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Tag as TagInterface } from "./types";
import { Tag } from "lucide-react";

export default function TagFormDialog() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<TagInterface[]>([]);

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
        setTags(tags.map((tag: TagInterface) => ({ ...tag, selected: false })));

      } catch (error: any) {
        console.error("Error creating tag:", error.message);
      }
    };
    fetchTags();
  }, []);

  // change later
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!name) return; // simple validation

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create tag");
      }

      const newTag = await res.json();
      console.log("Tag created:", newTag);

      // Optionally update local state to show the new tag
      setTags((prev: TagInterface[]) => [...prev, ...newTag]);

    } catch (error: any) {
      console.error("Error creating tag:", error.message);
      // Optionally show toast or alert
    } finally {
      setLoading(false);
      setName("");
    }
  };
  console.log("Tags:", tags);
  return (
    <Dialog>
      <DialogTrigger asChild ><Button variant="outline">
        <Tag /> Manage Tags
      </Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tags</DialogTitle>
          <DialogDescription>
            Manage your Tags
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <div className="flex flex-col gap-6">
            <Label htmlFor="album-name">Name</Label>
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
                {loading ? <span>Loading...</span> : <span>Add Tag</span>}
              </Button>
            </div>
          </div>
        </form>
        <div className="flex flex-wrap gap-2 mt-5">
          {tags.length === 0 ? <span>No tags found</span> :
            tags.map((tag: TagInterface) => (
              <Badge key={`tag-${tag.id}`} variant="secondary">{tag.name}</Badge>
            ))
          }
        </div>

      </DialogContent>
    </Dialog>
  )
};
