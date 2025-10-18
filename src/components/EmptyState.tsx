import { IconFolderCode } from "@tabler/icons-react";
import AlbumFormDialog from "./album/AlbumFormDialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

export default function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Albums Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any albums yet. Get started by creating your
          first album.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <AlbumFormDialog />
        </div>
      </EmptyContent>
    </Empty>
  );
}
