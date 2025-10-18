import { IconFolderCode } from "@tabler/icons-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

interface EmptyStateProps {
  type: "album" | "photo";
}

export default function EmptyState({ type }: EmptyStateProps) {
  const isAlbum = type === "album";
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>
          {isAlbum ? "No Albums Yet. " : "No Photos found for this album. "}
        </EmptyTitle>
        <EmptyDescription>
          {isAlbum ? (
            <p className="text-muted-foreground">
              Get started by creating your first album.
            </p>
          ) : (
            <p className="text-muted-foreground">Add a photo to get started.</p>
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
