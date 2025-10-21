import { NextRequest, NextResponse } from "next/server";
import { getAlbum } from "@/lib/albums";

interface AlbumRouteContext {
  params: {
    id: string;
  };
}

const GET = async (request: NextRequest, context: AlbumRouteContext) => {
  const { id } = context.params; // at runtime this is just { id: string }
  const numericId = Number(id);

  try {
    if (!id || isNaN(numericId)) {
      return NextResponse.json(
        { error: "Album ID is required" },
        { status: 400 },
      );
    }

    const album = await getAlbum(Number(id));
    return NextResponse.json(album, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
};

export { GET };
