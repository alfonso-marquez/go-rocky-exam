import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export default function AlbumDeleteDialog({
  open,
  onOpenChange,
  id,
  onAlbumDelete,
  // fetchAlbums,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  onAlbumDelete: (id: string) => void;
  // fetchAlbums: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("albums").delete().eq("id", id);

    if (!error) {
      onAlbumDelete(id);
      toast.success("Album deleted successfully.");
    }

    if (error) {
      toast.error("Album deletion failed.");
    }

    onOpenChange(false);
    setLoading(false);

    return;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Album</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this album?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDelete}>
          <div className="flex flex-col gap-6">
            <Button type="submit" disabled={loading} variant="destructive">
              {loading ? (
                <>
                  <Spinner />
                  <span>Deleting Album</span>
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
