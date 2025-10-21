import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export default function AlbumDeleteDialog({
  open,
  onOpenChange,
  id,
  onAlbumDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  onAlbumDelete: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/albums", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      onAlbumDelete(id);
      toast.success("Success!", {
        description: "Your album has been deleted successfully.",
      });
      router.refresh();
    } catch {
      toast.error("Album deletion failed. Please contact support.");
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
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
